from django.contrib import admin
from django.urls import path, include  # includeは別のurls.pyを読み込むための関数
from rest_framework.routers import DefaultRouter  # RouterはViewSetのURLを自動生成する
from library import views

router = DefaultRouter()
router.register('books', views.BookViewSet)          # /api/books/ と /api/books/{id}/ を生成
router.register('categories', views.CategoryViewSet) # /api/categories/ と /api/categories/{id}/ を生成
router.register('loans', views.LoanViewSet)          # /api/loans/ と /api/loans/{id}/ を生成

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hello/', views.hello),
    path('api/', include(router.urls)),  # /api/ 以下にrouterで生成したURLを接続する
]
