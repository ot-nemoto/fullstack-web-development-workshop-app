from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from library import views

router = DefaultRouter()
router.register('books', views.BookViewSet)
router.register('categories', views.CategoryViewSet)
router.register('loans', views.LoanViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
