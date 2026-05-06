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

### Issue 2｜Chapter 2-5：DevContainer の構成を単一ウィンドウに変更する

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: ワークショップでは「バックエンド用」「フロントエンド用」の2つの DevContainer を別々の VSCode ウィンドウで起動する構成になっている。これは以下の問題を引き起こす：

- バックエンドを先に起動しないとフロントエンドのコンテナが存在せず起動できない
- 2つのウィンドウを使い分ける必要があり、初心者には混乱しやすい
- git 操作をどちらのウィンドウで行うか不明確

**推奨構成**: VSCode ウィンドウを1つにまとめた単一 DevContainer 構成に変更する。

**構成の概要**:
- Python と Node.js を1つのコンテナに統合する
- VSCode は1つのウィンドウで Django・Next.js 両方を操作できる
- git はコンテナ内のターミナルからそのまま実行できる

**修正案**:
```
> **注意**：この構成では VSCode ウィンドウは1つです。
> ターミナルを複数開いて Django と Next.js をそれぞれ起動してください。
```

---

### Issue 3｜Chapter 3-2：Django 起動コマンドとブラウザ URL

**該当箇所**: `chapters/03_はじめての全通.md` > 3-2 Djangoの起動と確認

**問題1**: ワークショップには以下のコマンドが記載されている：

```bash
python manage.py runserver
```

Docker コンテナ内で実行する場合、デフォルトでは `127.0.0.1`（コンテナ内部）にバインドされるため、ホスト（Windows）のブラウザからアクセスしても `ERR_EMPTY_RESPONSE` になる。

**正しいコマンド**:
```bash
python manage.py runserver 0.0.0.0:8000
```

**問題2**: Django の起動ログに `http://0.0.0.0:8000/` と表示されるが、このURLはブラウザで開いても動作しない。

**ブラウザでのアクセス先**: `http://localhost:8000/`

`0.0.0.0` は「全ネットワークインターフェースで待ち受ける」というサーバー側の設定であり、ブラウザでアクセスできるアドレスではない。

**修正案**:
```
> **DevContainerの方へ**：コンテナ内で起動する場合は `0.0.0.0:8000` を指定します。
> `127.0.0.1` はコンテナ内部のみに限定されるため、ブラウザからアクセスできません。
> 起動ログに `http://0.0.0.0:8000/` と表示されますが、
> ブラウザでは `http://localhost:8000/` でアクセスしてください。
```

---

### Issue 4｜Chapter 2-5：DevContainer 設定ファイルの作成手順がない

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: ワークショップの目的は「一から自分の手で作り上げること」であるにもかかわらず、現在の記述は以下のようになっている：

> 「本書のサンプルリポジトリをcloneします」
> ```bash
> git clone https://github.com/ot-nemoto/fullstack-web-development-workshop-app.git
> ```

これでは学習者は各ファイルの中身を理解しないまま DevContainer を使うことになり、**教材として不完全**。

**作成が必要なファイル**:

| ファイル | 役割 |
|---------|------|
| `.devcontainer/Dockerfile` | 開発コンテナのビルド定義（Python + Node.js） |
| `.devcontainer/docker-compose.yml` | 開発用サービス定義（dev + db） |
| `.devcontainer/devcontainer.json` | VSCode DevContainer の設定 |
| `docker-compose.yml` | 本番参照用のサービス定義 |

**修正案**: 2-5 に 🛠️ セクションとして各ファイルの作成手順を追加する。

```markdown
### 🛠️ DevContainer の設定ファイルを作成する

以下のファイルを作成してください。

**`.devcontainer/Dockerfile`**
\```dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    git \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*
\```

**`.devcontainer/docker-compose.yml`**
\```yaml
services:
  dev:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
      - gh-config:/root/.config/gh
    ports:
      - "8000:8000"
      - "3000:3000"
    command: sleep infinity
    environment:
      - DB_HOST=db
      - DB_NAME=library
      - DB_USER=root
      - DB_PASSWORD=password
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: library
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
  gh-config:
\```

**`.devcontainer/devcontainer.json`**
\```json
{
  "name": "Fullstack Dev",
  "dockerComposeFile": "docker-compose.yml",
  "service": "dev",
  "workspaceFolder": "/workspace",
  "postCreateCommand": "pip install -r /workspace/backend/requirements.txt && npm install --prefix /workspace/frontend",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-python.vscode-pylance",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  }
}
\```
```

また、サンプルリポジトリの clone 手順は「答え合わせ用」の参照として残しつつ、**自分でファイルを作成してから DevContainer を起動する**という構成に変更することを推奨する。

---

### Issue 5｜各章末：GitHub への push 手順・ブランチ運用方針がない

**該当箇所**: 全章の末尾（まとめセクション）

**問題**: Chapter 2 で Git の基本操作（add / commit / push）は教えているが、**各章の実装完了後に commit・push するよう促す指示が一切ない**。また、どのブランチで作業するかも明示されていない。

**ブランチ運用方針**:

初心者向けワークショップという性質を踏まえ、以下の方針を推奨する：

| フェーズ | ブランチ | 理由 |
|---------|---------|------|
| Chapter 2〜13 | `master` のみ | 序盤からブランチを意識させると Git 操作の複雑さが学習の妨げになるため |
| Chapter 14〜 | `develop` / `feature/xxx` | Chapter 14 でブランチ戦略を正式に学ぶタイミングで切り替える |

**修正案**: 各章の「まとめ」の直前に以下の 🛠️ セクションを追加する。

```markdown
### 🛠️ ここまでの変更を GitHub に保存する

この章で行った変更を commit して GitHub に push しましょう。

\```bash
git add .
git commit -m "chapter XX: （この章で実装した内容の概要）"
git push origin master
\```

commit メッセージの例：
- `chapter 02: 開発環境を構築する`
- `chapter 03: DjangoとNext.jsの全通を確認する`
- `chapter 05: Djangoモデルを定義してマイグレーションする`
```

**対象章**: Chapter 2・3・5・6・7・8・9・10・11・12・13（コードの変更がある章すべて）

> Chapter 14 では「ブランチ戦略とプルリクエスト」を学ぶため、そこで `master` 直push から develop / feature ブランチへの切り替えを案内する。

---

### Issue 6｜Chapter 2-5：DevContainer 内で git・gh が使えない／gh 認証の永続化

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: Dockerfile に `git` と `gh`（GitHub CLI）がインストールされていないため、DevContainer 内のターミナルで git / gh コマンドが使えない。

**修正案**: `.devcontainer/Dockerfile` に `git`・`gh` を追加する（Issue 4 の Dockerfile に含まれている）。

**gh 認証の永続化**:

`git push` には GitHub 認証が必要。コンテナを再起動するたびに `gh auth login` を実行しなくて済むよう、`gh-config` ボリュームで認証情報を永続化する（Issue 4 の `docker-compose.yml` に含まれている）。

```yaml
volumes:
  - gh-config:/root/.config/gh
```

**初回セットアップ**:

DevContainer 起動後、コンテナ内のターミナルで1回だけ実行する：

```bash
gh auth login
```

以降はコンテナを再起動しても認証済みの状態が維持される。

> **補足**：ホストマシン（Windows）で `gh auth login` 済みの場合、認証情報はホストの `%APPDATA%\GitHub CLI\` に保存されているが、コンテナとは共有されない。コンテナ内での認証は別途必要。

---

## 修正方針

上記6点について、ワークショップ教材リポジトリ（`fullstack-web-development-workshop`）の該当 Markdown ファイルおよびサンプルリポジトリを修正してください。

- **Issue 1**: Windows ユーザー向けの補足として `> **Windowsの方へ**` の形式で追記（既存の記法と統一）
- **Issue 2**: 単一 DevContainer 構成への変更を反映。2つのウィンドウを起動する手順を1つに統合する
- **Issue 3**: コマンドを `python manage.py runserver 0.0.0.0:8000` に変更。ブラウザでのアクセス先が `localhost:8000` である旨を `> **DevContainerの方へ**` の形式で補足
- **Issue 4**: 2-5 に 🛠️ セクションを追加し、`.devcontainer/Dockerfile`・`.devcontainer/docker-compose.yml`・`.devcontainer/devcontainer.json` の作成手順を記載。clone は「答え合わせ参照用」として位置づけを変更
- **Issue 5**: 各章の「まとめ」直前に 🛠️ セクションとして commit・push 手順を追加。Chapter 2〜13 は `master` で運用し、Chapter 14 でブランチ戦略へ移行する流れにする
- **Issue 6**: Issue 4 の Dockerfile に `git`・`gh` を追加。`docker-compose.yml` に `gh-config` ボリュームを追加して認証情報を永続化。Chapter 2-3 の `gh auth login` はコンテナ内で1回実行すれば以降不要である旨を明記
