from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from library import views

router = DefaultRouter()
router.register('books', views.BookViewSet)
router.register('categories', views.CategoryViewSet)
router.register('loans', views.LoanViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # POST /api/token/ にユーザー名・パスワードを送るとアクセストークンとリフレッシュトークンを返す
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # POST /api/token/refresh/ にリフレッシュトークンを送ると新しいアクセストークンを返す
]
