from django.utils import timezone  # タイムゾーンを考慮した日時操作
from rest_framework import viewsets, permissions, status
from rest_framework import serializers as drf_serializers  # views内でserializersを使うためエイリアスで区別する
from rest_framework.decorators import action  # カスタムアクションを定義するデコレータ
from rest_framework.response import Response
from .models import Book, Category, Loan
from .serializers import BookSerializer, CategorySerializer, LoanSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # IsAuthenticatedOrReadOnly: GETは誰でも可、POST/PUT/DELETEはログイン必須


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticated]
    # IsAuthenticated: すべての操作にログイン必須

    def get_queryset(self):
        # ModelViewSet には「全件返す」デフォルト動作が入っている
        # get_queryset を定義し直す（オーバーライドする）ことで「自分の貸出のみ返す」に変更する
        return Loan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # perform_create も同様に「保存するだけ」のデフォルト動作を上書きする
        # ここに独自の処理（貸出可能チェック・ユーザー自動設定など）を追加する
        book = serializer.validated_data['book']
        user = self.request.user

        # 貸出可能冊数チェック。ValidationError を発生させると DRF が HTTP 400 を返す
        if book.available_count <= 0:
            raise drf_serializers.ValidationError({'book': 'この本は現在貸出できません'})

        # 重複貸出チェック：同一ユーザー・同一本・ステータス:active のレコードが存在するか確認する
        already_loaned = Loan.objects.filter(
            book=book,
            user=user,
            status='active',
        ).exists()  # exists() は該当レコードが存在するか bool で返す
        if already_loaned:
            raise drf_serializers.ValidationError({'book': 'この本はすでに借りています'})

        # 貸出レコードを作成する
        serializer.save(user=user)

        # 貸出可能冊数を1減らす
        book.available_count -= 1
        book.save()

    @action(detail=True, methods=['post'], url_path='return')
    # @action: 関数に「これは新しいAPIエンドポイントになる」という情報を付ける印（デコレータ）
    # この1行を付けるだけで return_book 関数が /api/loans/{id}/return/ というURLに対応するようになる
    # detail=True: /api/loans/{id}/return/ のようにIDが必要なエンドポイント
    # methods=['post']: POSTメソッドのみ受け付ける
    # url_path='return': URLの末尾を 'return' にする
    def return_book(self, request, pk=None):
        # pk は URLの {id} 部分（Primary Key）
        try:
            loan = Loan.objects.get(pk=pk, user=request.user, status='active')
        except Loan.DoesNotExist:  # DoesNotExist: get() で該当レコードがない場合に発生する例外
            return Response(
                {'detail': '貸出が見つかりません'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # 返却処理
        loan.status = 'returned'
        loan.return_date = timezone.now().date()  # 今日の日付を記録する
        loan.save()

        # 貸出可能冊数を1増やす
        loan.book.available_count += 1
        loan.book.save()

        serializer = LoanSerializer(loan)
        return Response(serializer.data)
