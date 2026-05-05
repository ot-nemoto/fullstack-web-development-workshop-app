from rest_framework import viewsets, permissions  # permissionsを追加する
from .models import Book, Category, Loan
from .serializers import BookSerializer, CategorySerializer, LoanSerializer


class CategoryViewSet(viewsets.ModelViewSet):  # ModelViewSetはCRUD全操作を提供するクラス
    queryset = Category.objects.all()          # 操作対象のQuerySet
    serializer_class = CategorySerializer      # 使用するSerializer
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
