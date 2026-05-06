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

### Issue 4｜Chapter 2-5：Dockerfile・devcontainer.json の作成手順がない

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: ワークショップの目的は「一から自分の手で作り上げること」であるにもかかわらず、現在の記述は以下のようになっている：

> 「本書のサンプルリポジトリをcloneします」
> ```bash
> git clone https://github.com/ot-nemoto/fullstack-web-development-workshop-app.git
> ```

これでは学習者は Dockerfile・devcontainer.json の中身を理解しないまま DevContainer を使うことになり、**教材として不完全**。

**不足しているファイルと内容**:

`docker-compose.yml` は Chapter 2 内で全内容が掲載されているが、以下のファイルの作成手順・内容が一切記載されていない：

| ファイル | 役割 |
|---------|------|
| `.devcontainer/backend/Dockerfile` | Python 環境のビルド定義 |
| `.devcontainer/backend/devcontainer.json` | Backend DevContainer の設定 |
| `.devcontainer/frontend/Dockerfile` | Node.js 環境のビルド定義 |
| `.devcontainer/frontend/devcontainer.json` | Frontend DevContainer の設定 |

**修正案**: 2-5 に 🛠️ セクションとして各ファイルの作成手順を追加する。

```markdown
### 🛠️ DevContainer の設定ファイルを作成する

以下のファイルを作成してください。

**`.devcontainer/backend/Dockerfile`**
\```dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*
\```

**`.devcontainer/backend/devcontainer.json`**
\```json
{
  "name": "Backend (Django)",
  "dockerComposeFile": "../../docker-compose.yml",
  "service": "backend",
  "workspaceFolder": "/workspace",
  "postCreateCommand": "pip install -r requirements.txt"
}
\```

**`.devcontainer/frontend/Dockerfile`**
\```dockerfile
FROM node:20-slim
\```

**`.devcontainer/frontend/devcontainer.json`**
\```json
{
  "name": "Frontend (Next.js)",
  "dockerComposeFile": "../../docker-compose.yml",
  "service": "frontend",
  "workspaceFolder": "/workspace",
  "postCreateCommand": "npm install"
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

### Issue 6｜Chapter 2-5：DevContainer 内で git が使えない

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: 現在の Dockerfile には `git` がインストールされていないため、DevContainer 内のターミナルで git コマンドが使えない。

Issue 5 で各章末に `git add / commit / push` を追加する方針だが、**実行する場所がない**状態になっている。

解決策として以下の2択がある：

| | 方法 | 評価 |
|-|------|------|
| A | Windows ホストのターミナルで git を操作する | DevContainer と別のターミナルを使い分ける必要があり、初心者には混乱しやすい |
| B | Dockerfile に git をインストールする | DevContainer 内で完結でき、初心者にわかりやすい ✅ 推奨 |

**修正案（Option B）**: 両 Dockerfile に `git` と `gh`（GitHub CLI）を追加する。

`git push` には GitHub 認証が必要なため、`git` だけでなく `gh` も合わせてインストールする。

**`.devcontainer/backend/Dockerfile`**
```dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    git \
    curl \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*
```

**`.devcontainer/frontend/Dockerfile`**
```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*
```

あわせて、`docker-compose.yml` に `gh-config` ボリュームを追加して認証情報を永続化する。両コンテナで同じボリュームを共有するため、**どちらか一方で `gh auth login` を1回実行すれば**、もう一方でも認証済みの状態で使える。

```yaml
services:
  backend:
    volumes:
      - ./backend:/workspace:cached
      - gh-config:/root/.config/gh  # gh認証情報を永続化（両コンテナで共有）

  frontend:
    volumes:
      - ./frontend:/workspace:cached
      - gh-config:/root/.config/gh  # gh認証情報を永続化（両コンテナで共有）

volumes:
  mysql_data:
  gh-config:                        # gh認証情報の永続化ボリューム
```

Chapter 2-3「GitHubとリモートリポジトリを連携する」の `gh auth login` 手順は、DevContainer 起動後にコンテナ内のターミナルで実行する旨を明記する。また、ホストで認証済みの場合はボリュームマウントで流用できる仕組みがあることを概念説明として補足する（手順の記載は不要）。

---

### Issue 7｜Chapter 2-5：DevContainer 内で git がリポジトリを認識しない

**該当箇所**: `chapters/02_開発環境の構築.md` > 2-5 DevContainerの起動と確認

**問題**: `docker-compose.yml` では `./backend:/workspace` および `./frontend:/workspace` とマウントしているため、コンテナ内の `/workspace` には各サービスのサブディレクトリのみが展開される。`.git` ディレクトリはリポジトリルートにあるため、コンテナ内では見えない。

結果として、コンテナ内のターミナルで `git status` を実行すると以下のエラーになる：

```
fatal: not a git repository (or any parent up to mount point /)
```

Issue 5 で各章末に追加する `git add / commit / push` 手順は、コンテナ内から実行できない状態になっている。

**修正案**: `docker-compose.yml` の両サービスにリポジトリルートを `/repo` としてマウントを追加する。

```yaml
services:
  backend:
    volumes:
      - ./backend:/workspace:cached
      - .:/repo:cached              # リポジトリルートをマウント（git操作用）
      - gh-config:/root/.config/gh

  frontend:
    volumes:
      - ./frontend:/workspace:cached
      - .:/repo:cached              # リポジトリルートをマウント（git操作用）
      - gh-config:/root/.config/gh
```

あわせて、Issue 5 の git 手順を以下のように変更する（`/repo` に移動してから実行）：

```bash
cd /repo
git add .
git commit -m "chapter XX: （この章で実装した内容の概要）"
git push origin master
```

---

## 修正方針

上記6点について、ワークショップ教材リポジトリ（`fullstack-web-development-workshop`）の該当 Markdown ファイルおよびサンプルリポジトリを修正してください。

- **Issue 1〜3**: Windows ユーザー向けの補足として `> **Windowsの方へ**` または `> **DevContainerの方へ**` の形式で追記（既存の記法と統一）
- **Issue 4**: 2-5 に 🛠️ セクションを追加し、各ファイルの作成手順を記載。clone は「答え合わせ参照用」として位置づけを変更
- **Issue 5**: 各章の「まとめ」直前に 🛠️ セクションとして commit・push 手順を追加。Chapter 2〜13 は `master` で運用し、Chapter 14 でブランチ戦略へ移行する流れにする
- **Issue 6**: 両 Dockerfile に `git` と `gh` を追加。`docker-compose.yml` に `gh-config` ボリュームを追加して認証情報を永続化（両コンテナ共有）。Chapter 2-3 の `gh auth login` はコンテナ内で1回実行すれば両コンテナで使える旨を明記。ホストからの流用は概念説明のみ
- **Issue 7**: `docker-compose.yml` の両サービスに `.:/repo:cached` マウントを追加。Issue 5 の git 手順は `cd /repo` してから実行するよう変更
