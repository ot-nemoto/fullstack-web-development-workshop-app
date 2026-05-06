# ワークショップ不足箇所 修正依頼（v1.0 動作確認時に発覚）

## 対象リポジトリ

- **ワークショップ教材**: https://github.com/ot-nemoto/fullstack-web-development-workshop
- **動作確認バージョン**: v1.0（Chapter 2 開発環境の構築 〜 Chapter 3-3 Next.js起動確認）
- **動作確認環境**: Windows 11 + Docker Desktop + VSCode Dev Containers

---

## 不足箇所一覧

### Issue 1｜Chapter 2-4：Windowsファイアウォールのダイアログ

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-4 Dockerの概念

**問題**: Docker Desktop の初回起動時に Windows セキュリティのダイアログが表示されるが、ワークショップに記載がない。

> 「パブリック ネットワークとプライベート ネットワークにこのアプリへのアクセスを許可しますか？（Docker Desktop Backend）」

**対応**: 「許可」を押さないとコンテナ間通信・ポートフォワードが機能しない。Windows ユーザー向けの補足として追記が必要。

**修正案**:
```
> **Windowsの方へ**：Docker Desktop の初回起動時に Windows ファイアウォールの
> 許可ダイアログが表示される場合があります。「許可」を選択してください。
> 許可しないとコンテナ間の通信やブラウザからのアクセスが機能しません。
```

---

### Issue 2｜Chapter 2-5：DevContainer の起動順序

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: ワークショップには「バックエンド用」「フロントエンド用」の DevContainer を起動する手順が書かれているが、**バックエンドを先に起動する必要がある**ことが明記されていない。

**背景**:
- Backend DevContainer を開くと、`docker-compose up` で **backend / frontend / db の3コンテナが全て起動**する
- その後 Frontend DevContainer を開くと、既に起動中の `frontend-1` コンテナに接続する
- **バックエンドを先に開かないと frontend コンテナが存在しないため、Frontend DevContainer が起動できない**

**修正案**:
```
> **注意**：必ずバックエンドの DevContainer を先に起動してください。
> バックエンドを開くと docker-compose によって全サービス（backend / frontend / db）が
> 起動します。その後フロントエンドの DevContainer を開くと、
> 既に起動中のコンテナに接続されます。
```

---

### Issue 3｜Chapter 3-2：Django 起動コマンド

**該当箇所**: `chapters/03_はじめての全通.md` > 3-2 Djangoの起動と確認

**問題**: ワークショップには以下のコマンドが記載されている：

```bash
python manage.py runserver
```

しかし Docker コンテナ内で実行する場合、デフォルトでは `127.0.0.1`（コンテナ内部）にバインドされるため、ホスト（Windows）のブラウザから `http://localhost:8000/` にアクセスしても `ERR_EMPTY_RESPONSE` になる。

**正しいコマンド**:
```bash
python manage.py runserver 0.0.0.0:8000
```

`0.0.0.0` を指定することで、コンテナ外（ホストのブラウザ）からのアクセスが可能になる。

**修正案**: コマンドを以下に変更し、理由も補足する：
```
> **DevContainerの方へ**：コンテナ内で起動する場合は `0.0.0.0:8000` を指定します。
> `127.0.0.1` はコンテナ内部のみに限定されるため、ブラウザからアクセスできません。
```

---

## 修正方針

上記3点について、ワークショップ教材リポジトリ（`fullstack-web-development-workshop`）の該当 Markdown ファイルを修正してください。

修正は**Windows ユーザー向けの補足**として `> **Windowsの方へ**` または `> **DevContainerの方へ**` の形式で追記するスタイルが既存の記法と統一されます（Chapter 2 内で同様の記法が使われています）。
