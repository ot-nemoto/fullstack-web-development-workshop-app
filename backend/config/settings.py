from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# startproject が生成するランダムな SECRET_KEY をそのまま使用しています。
# 本番環境では環境変数で安全な値を注入してください（Chapter 15 で対応します）。
SECRET_KEY = 'django-insecure-k#8x!q2w9e$r6t5y@u3i1o0p7a4s*d%f^g&h(j)lz'

DEBUG = True

# startproject からの変更点：
# デフォルトは [] です。DevContainer 内から外部（ブラウザ）へのアクセスを
# 許可するために '*' を設定しています。
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # 追加する
    'rest_framework',
    'rest_framework_simplejwt',  # 追加する
    'library',  # 追加するアプリはここに書く
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # 追加する（できるだけ上に置く）
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # 使用するDBの種類
        'NAME': 'library',                      # データベース名
        'USER': 'root',                         # ユーザー名
        'PASSWORD': 'password',                 # パスワード
        'HOST': 'db',                           # ホスト名（docker-composeのサービス名）
        'PORT': '3306',                         # ポート番号
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# startproject からの変更点：
# LANGUAGE_CODE のデフォルトは 'en-us'、TIME_ZONE のデフォルトは 'UTC' です。
# 日本語・日本時間に設定しています。
LANGUAGE_CODE = 'ja'
TIME_ZONE = 'Asia/Tokyo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 許可するオリジンのリスト
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]

# DRFのデフォルト認証方式をJWTに設定する
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# JWTの有効期間を設定する
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),   # アクセストークンは30分
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),       # リフレッシュトークンは7日
}
