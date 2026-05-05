from django.contrib import admin
from django.urls import path, include  # includeは別のurls.pyを読み込むための関数
from rest_framework.routers import DefaultRouter  # RouterはViewSetのURLを自動生成する
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from library import views

router = DefaultRouter()
router.register('books', views.BookViewSet)          # /api/books/ と /api/books/{id}/ を生成
router.register('categories', views.CategoryViewSet) # /api/categories/ と /api/categories/{id}/ を生成
router.register('loans', views.LoanViewSet)          # /api/loans/ と /api/loans/{id}/ を生成

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # /api/ 以下にrouterで生成したURLを接続する
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # POST /api/token/ にユーザー名・パスワードを送るとアクセストークンとリフレッシュトークンを返す
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # POST /api/token/refresh/ にリフレッシュトークンを送ると新しいアクセストークンを返す
]
