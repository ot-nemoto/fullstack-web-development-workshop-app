from django.http import JsonResponse  # from〜importは他のファイルから機能を読み込む書き方
from rest_framework import viewsets  # DRFのviewsetsモジュールを読み込む
from .models import Book, Category, Loan
from .serializers import BookSerializer, CategorySerializer, LoanSerializer


def hello(request):  # defは関数の定義。処理に名前をつけてまとめる
    return JsonResponse({"message": "Djangoからこんにちは！"})  # returnはこの関数が返す値を指定する


class CategoryViewSet(viewsets.ModelViewSet):  # ModelViewSetはCRUD全操作を提供するクラス
    queryset = Category.objects.all()          # 操作対象のQuerySet
    serializer_class = CategorySerializer      # 使用するSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
