from django.test import TestCase               # Django組み込みのテストクラス
from django.contrib.auth.models import User
from rest_framework.test import APIClient      # DRFのAPIテスト用クライアント
from rest_framework import status              # HTTPステータスコードの定数
from .models import Book, Category, Loan
from datetime import date, timedelta


class BookModelTestCase(TestCase):

    def setUp(self):                           # setUp は各テストメソッドの前に必ず実行される
        self.category = Category.objects.create(name='プログラミング')

    def test_book_str_returns_title(self):       # __str__ が正しく動くか
        book = Book.objects.create(
            title='テスト本',
            author='テスト著者',
            publisher='テスト出版社',
            isbn='9784000000001',
            category=self.category,
            available_count=1,
        )
        self.assertEqual(str(book), 'テスト本')  # assertEqual は2つの値が等しいか確認する

    def test_book_default_available_count(self):  # デフォルト値が正しいか
        book = Book.objects.create(
            title='テスト本2',
            author='テスト著者',
            publisher='テスト出版社',
            isbn='9784000000002',
        )
        self.assertEqual(book.available_count, 1)


class BookAPITestCase(TestCase):               # TestCaseを継承してテストクラスを定義する

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(  # テスト用ユーザーを作成する
            username='testuser',
            password='testpass123',
        )
        self.category = Category.objects.create(name='プログラミング')
        self.book = Book.objects.create(
            title='テスト本',
            author='テスト著者',
            publisher='テスト出版社',
            isbn='9784000000001',
            category=self.category,
            available_count=3,
        )

    def test_get_book_list(self):               # 一覧取得は認証なしで取得できる
        response = self.client.get('/api/books/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # 1件登録したので1件返ってくる

    def test_get_book_detail(self):
        response = self.client.get(f'/api/books/{self.book.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'テスト本')

    def test_create_book_requires_auth(self):   # 未認証では登録できない
        response = self.client.post('/api/books/', {
            'title': '新しい本',
            'author': '著者',
            'publisher': '出版社',
            'isbn': '9784000000099',
            'available_count': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_book_with_auth(self):       # 認証済みなら登録できる
        self.client.force_authenticate(user=self.user)
        # force_authenticate はトークンなしで認証済み状態にする（テスト用の便利メソッド）
        response = self.client.post('/api/books/', {
            'title': '新しい本',
            'author': '著者',
            'publisher': '出版社',
            'isbn': '9784000000099',
            'available_count': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 2)  # 元の1件 + 新規1件 = 2件


class LoanBoundaryTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='borrower', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(name='テスト')

    def _create_book(self, available_count):    # テスト用ヘルパーメソッド（_で始める慣例）
        return Book.objects.create(
            title='テスト本',
            author='テスト著者',
            publisher='テスト出版社',
            isbn=f'978400000{available_count:04d}',  # available_countを末尾に使って重複を避ける
            category=self.category,
            available_count=available_count,
        )

    def _loan_request(self, book_id):
        due_date = (date.today() + timedelta(days=14)).isoformat()
        return self.client.post('/api/loans/', {
            'book': book_id,
            'due_date': due_date,
        })

    def test_loan_rejected_when_available_count_is_zero(self):
        book = self._create_book(available_count=0)
        response = self._loan_request(book.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('book', response.data)    # エラーメッセージがbookフィールドに入っているか

    def test_available_count_decreases_on_loan(self):
        book = self._create_book(available_count=2)
        self._loan_request(book.id)
        book.refresh_from_db()                  # DBから最新の値を読み直す
        self.assertEqual(book.available_count, 1)

    def test_loan_rejected_when_last_copy_already_loaned(self):
        book = self._create_book(available_count=1)
        other_user = User.objects.create_user(username='other', password='pass123')

        # 他のユーザーが先に借りる
        other_client = APIClient()
        other_client.force_authenticate(user=other_user)
        due_date = (date.today() + timedelta(days=14)).isoformat()
        other_client.post('/api/loans/', {'book': book.id, 'due_date': due_date})

        # available_count が 0 になっているため、自分が借りようとするとエラーになる
        response = self._loan_request(book.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_loan_is_rejected(self):
        book = self._create_book(available_count=3)
        self._loan_request(book.id)             # 1回目：成功するはず

        response = self._loan_request(book.id)  # 2回目：同じ本を再度借りようとする
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('book', response.data)

    def test_loan_nonexistent_book(self):
        due_date = (date.today() + timedelta(days=14)).isoformat()
        response = self.client.post('/api/loans/', {
            'book': 99999,                      # 存在しないID
            'due_date': due_date,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
