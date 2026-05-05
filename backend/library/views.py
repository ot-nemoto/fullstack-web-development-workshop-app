from django.http import JsonResponse  # from〜importは他のファイルから機能を読み込む書き方


def hello(request):  # defは関数の定義。処理に名前をつけてまとめる
    return JsonResponse({"message": "Djangoからこんにちは！"})  # returnはこの関数が返す値を指定する
