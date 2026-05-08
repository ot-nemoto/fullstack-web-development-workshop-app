from django.db import models
from django.contrib.auth.models import User  # Djangoの組み込みUserモデルを使う


class Category(models.Model):  # classはクラスの定義。models.Modelを継承してDjangoモデルになる
    name = models.CharField(max_length=100)

    def __str__(self):  # __str__はオブジェクトを文字列で表したときの表示を定義する
        return self.name  # selfはこのオブジェクト自身を指す


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    publisher = models.CharField(max_length=100)
    isbn = models.CharField(max_length=13, unique=True)  # unique=Trueは重複を禁止する
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,  # カテゴリ削除時にこのカラムをNULLにする
        null=True,   # DBでNULLを許可する
        blank=True,  # フォームで空欄を許可する
    )
    available_count = models.IntegerField(default=1)  # default=1は未指定時の初期値

    def __str__(self):
        return self.title


class Loan(models.Model):
    STATUS_CHOICES = [  # 選択肢を定数として定義する
        ('active', '貸出中'),
        ('returned', '返却済み'),
        ('overdue', '延滞中'),  # 追加
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE)  # CASCADE: 本が削除されたら貸出も削除
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    loan_date = models.DateField(auto_now_add=True)  # auto_now_add=True: 作成時に自動で今日の日付を入れる
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"  # f"" はf文字列：{} の中に変数を埋め込める
