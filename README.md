# 実践フルスタックWeb開発ワークショップ 答え合わせリポジトリ

ワークショップ教材: [ot-nemoto/fullstack-web-development-workshop](https://github.com/ot-nemoto/fullstack-web-development-workshop)

各チャプターの完成コードを確認できる答え合わせ用リポジトリです。
特定のチャプターが完了した時点で Release / タグを設定しています。

## リリースタイミング

バージョンはワークショップの3部構成に対応しています。

### Part I：Webシステム開発の基礎

| タグ | チャプター | タイトル | 内容 |
|------|-----------|---------|------|
| [v1.0](../../releases/tag/v1.0) | Chapter 2 | 開発環境の構築 | DevContainer・Docker による初期開発環境のデフォルト状態 |
| [v1.1](../../releases/tag/v1.1) | Chapter 3 | はじめての全通 | Django・Next.js の起動確認、フルスタック接続の初回動作 |

### Part II：フルスタック実装

| タグ | チャプター | タイトル | 内容 |
|------|-----------|---------|------|
| [v2.0](../../releases/tag/v2.0) | Chapter 5 | データベース設計とDjangoモデル | MySQLとDjango接続、モデル定義、マイグレーション、管理画面 |
| [v2.1](../../releases/tag/v2.1) | Chapter 6 | REST APIの実装 | DRF による REST API 実装、Serializer・ViewSet・Router |
| [v2.2](../../releases/tag/v2.2) | Chapter 7 | JavaScriptとNext.js基礎 | Reactコンポーネント、モックデータによる本の一覧画面 |
| [v2.3](../../releases/tag/v2.3) | Chapter 8 | フロントエンドとバックエンドの接続 | CORS 設定、fetch による API 接続、ローディング・エラー処理 |
| [v2.4](../../releases/tag/v2.4) | Chapter 9 | 本の管理機能 | 本の一覧・詳細・登録・編集・削除（CRUD 完成） |
| [v2.5](../../releases/tag/v2.5) | Chapter 10 | 認証 | JWT 認証、ログイン画面、ルート保護 |
| [v2.6](../../releases/tag/v2.6) | Chapter 11 | 貸出管理機能 | 貸出・返却 API、貸出履歴、延滞チェック |
| [v2.7](../../releases/tag/v2.7) | Chapter 12 | バッチ処理 | Django カスタム管理コマンド、延滞ステータス更新バッチ |

### Part III：品質と運用

| タグ | チャプター | タイトル | 内容 |
|------|-----------|---------|------|
| [v3.0](../../releases/tag/v3.0) | Chapter 13 | テスト | Djangoテスト（モデル・API）、Next.js コンポーネントテスト |
| [v3.1](../../releases/tag/v3.1) | Chapter 14 | CI/CD | GitHub Actions ワークフロー（Django・Next.js の自動テスト） |

## リリースしないチャプター

| チャプター | 理由 |
|-----------|------|
| Chapter 1 Webシステムの仕組み | 概念説明のみ、コードなし |
| Chapter 4 PythonとDjango基礎 | Djangoプロジェクト構造の読み方（既存コードの説明） |
| Chapter 15 本番環境 | 本番デプロイは環境依存のため |
| Chapter 16 おわりに | コードなし |

## 技術スタック

- **フロントエンド**: Next.js (TypeScript) + Tailwind CSS
- **バックエンド**: Django + Django REST Framework
- **データベース**: MySQL
- **開発環境**: VSCode + DevContainer + Docker
