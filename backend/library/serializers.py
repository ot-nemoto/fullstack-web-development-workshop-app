from rest_framework import serializers
from .models import Book, Category, Loan


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'publisher',
            'isbn',
            'category',
            'available_count',
        ]

    def validate_isbn(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("ISBNは数字のみで入力してください")
        return value

    def validate_available_count(self, value):
        if value < 0:
            raise serializers.ValidationError("貸出可能冊数は0以上にしてください")
        return value


class LoanSerializer(serializers.ModelSerializer):
    book_detail = BookSerializer(source='book', read_only=True)

    class Meta:
        model = Loan
        fields = [
            'id',
            'book',
            'book_detail',
            'user',
            'loan_date',
            'due_date',
            'return_date',
            'status',
        ]
        read_only_fields = ['loan_date', 'user']
