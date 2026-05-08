from pathlib import Path
from datetime import timedelta
import os    # os モジュールは Python 標準ライブラリ。環境変数を読み取るのに使う

BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET_KEY は環境変数から読む。開発用デフォルト値はローカル専用
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-local-dev-key-change-this')

# DEBUG は環境変数 DEBUG が 'True' のときだけ True になる
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# 本番では公開するドメインを指定する。開発中は '*' で全許可
ALLOWED_HOSTS_ENV = os.environ.get('ALLOWED_HOSTS', '*')
ALLOWED_HOSTS = ALLOWED_HOSTS_ENV.split(',')

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
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'library'),
        # os.environ.get('変数名', デフォルト値) は環境変数がなければデフォルト値を使う
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'password'),
        'HOST': os.environ.get('DB_HOST', '127.0.0.1'),
        'PORT': os.environ.get('DB_PORT', '3306'),
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
