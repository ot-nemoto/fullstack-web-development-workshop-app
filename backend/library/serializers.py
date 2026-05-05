from rest_framework import serializers  # DRFのserializersモジュールを読み込む
from .models import Book, Category, Loan


class CategorySerializer(serializers.ModelSerializer):  # ModelSerializerはモデルと紐づいたSerializer
    class Meta:  # Metaクラスでこのシリアライザーの設定を定義する
        model = Category        # 対象のモデル
        fields = ['id', 'name'] # APIに含めるフィールド


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

    def validate_isbn(self, value):  # validate_フィールド名という名前で定義する
        if not value.isdigit():  # isdigit()は文字列が数字のみで構成されているか判定する
            raise serializers.ValidationError("ISBNは数字のみで入力してください")
        return value

    def validate_available_count(self, value):
        if value < 0:
            raise serializers.ValidationError("貸出可能冊数は0以上にしてください")
        return value


class LoanSerializer(serializers.ModelSerializer):
    book_detail = BookSerializer(source='book', read_only=True)
    # source='book' で book フィールドの内容を BookSerializer で展開する。read_only=True で書き込み不可

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
        read_only_fields = ['loan_date', 'user']  # 自動セットするフィールドは読み取り専用にする
