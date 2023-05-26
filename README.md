# vote-app-vue2-ts

## セットアップ

.env の準備
担当者に依頼してください

```
npm ci
```

### 開発用サーバーを立てる

```
npm run serve
```

### 静的ファイルの出力

```
npm run build
```

### 本番サーバーへデプロイ

```
npm run deploy
```

### 本番サーバー url

```

https://vote-app-vue.web.app/
```

### アカウント情報

```
一般アカウント(投票側)

email:testsample@sample.com
pw:88888888

管理者アカウント(集計側)

email:admin@sample.com
pw:88888888

```

### アプリの説明

投票の集計を目的としたアプリです。

会員登録することで投票ができます。
管理者のみ以下の URL にアクセスすることでき、集計の確認ができます。
https://vote-app-vue.web.app/admin
※admin ページにある、contents というページは、CRUD の処理の練習用に作っただけなので、意味はありません。
