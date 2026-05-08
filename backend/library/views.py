from rest_framework import viewsets, permissions  # permissionsを追加する
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
