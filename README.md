# PromptHub

Web 上に溢れている ChatGPT のプロンプト例を登録・整理できる Web アプリです。<br>
OpenAI API の stream に対応しています。<br>
Google アカウントで Signin するとプロンプトが登録できます。<br>
現状の仕様ではデプロイした人の API キーで固定されるため、広く公開する際は改修する必要があります。
<br>
<br>

この Web アプリは [T3 Stack](https://create.t3.gg/)をベースにして開発しています。

<br>

## 技術スタック

- Next.js
- TypeScript
- Supabase
- Prisma
- tRPC
- Auth.js
- Tailwind CSS
- Zod
- Zustand

## 機能

- タイトル、概要、参考 URL、タグにてプロンプト例を登録
- OpenAI API を用いて登録例への GPT-4 からのレスポンスを生成し、例と合わせてデータベースに保存
- 登録済みプロンプトの一覧表示
- タグによる検索と管理

## 前提条件

- Node.js
- Docker
- Supabase CLI
- Prisma CLI

## セットアップ

1. このリポジトリをクローンします。

```
git clone https://github.com/sa-morishita/gpt4-prompt-hub
```

2. ディレクトリに移動します。

```
cd gpt4-prompt-hub
```

3. npm パッケージをインストールします。

```
npm install
```

4. 環境変数を設定します。`.env.local`ファイルをプロジェクトのルートディレクトリに作成し、以下の内容を記述します。

```
DATABASE_URL=PrismaのURL
NEXTAUTH_SECRET=openssl rand -base64 32で生成
NEXTAUTH_URL="http://localhost:3000" or 本番環境URL

GOOGLE_CLIENT_SECRET=Google APIのクライアントシークレット
GOOGLE_CLIENT_ID=Google APIのクライアントID

OPENAI_API_KEY=あなたの OpenAI_API キー
OPENAI_API_MODEL=gpt-4 または使用するモデル


NEXT_PUBLIC_LOGFLARE_API_KEY=あなたの Logflare のプロジェクトのAPIキー
NEXT_PUBLIC_LOGFLARE_SOURCE_ID= あなたの Logflare のプロジェクトのSource ID
```

5. Supabase のローカルインスタンスを起動します。

```
supabase start
```

6. Prisma のデータベーススキーマを更新します。

```
npx prisma db push
```

7. 開発サーバーを起動します。

```
npm run dev
```

アプリケーションは`http://localhost:3000`でアクセスできるようになります。

---
