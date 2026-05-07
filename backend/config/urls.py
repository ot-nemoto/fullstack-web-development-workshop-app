from django.contrib import admin
from django.urls import path
from library import views  # libraryアプリのviewsモジュールを読み込む

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hello/', views.hello),  # /api/hello/ へのリクエストをhello関数に渡す
]
