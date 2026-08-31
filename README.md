# 三宮胃腸内科 患者様アンケート

三宮胃腸内科向けの匿名患者様アンケートです。Next.js App Router、TypeScript、Tailwind CSSで構築し、Google Apps Script経由でGoogle Sheetsへ回答を保存できます。GAS未設定時もローカルモードで入力、validation、スコア計算、サンクス画面まで確認できます。

## 質問内容

1. 本日のご来院目的（単一選択・必須）
2. 診療内容の満足度（1〜10・必須）
3. スタッフ対応の満足度（1〜10・必須）
4. 当院を選んだ理由（単一選択・必須）
5. ご意見・ご要望（自由記述・任意・最大1000文字）

Q2とQ3から合計スコアと平均スコアを内部計算し、GAS送信payloadに含めます。氏名、電話番号、メールアドレス、住所は取得しません。

## ローカル起動

Node.js 20.9以上を使用してください。

```bash
npm install
cp .env.example .env.local
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。両方の環境変数が空でも回答からサンクス画面まで動作します。

## 環境変数

```env
NEXT_PUBLIC_GAS_URL=
NEXT_PUBLIC_GOOGLE_REVIEW_URL=
```

- `NEXT_PUBLIC_GAS_URL`: Apps Scriptをウェブアプリとしてデプロイした際のURL。
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL`: Google Business Profileの口コミ投稿URL。設定時だけサンクス画面にCTAを表示します。点数による表示選別はありません。
- `.env.local` はGit管理対象外です。秘密情報をコミットしないでください。

## Google Sheets / GAS設定

1. 回答保存先として空のGoogleスプレッドシートを作成します。
2. スプレッドシートの「拡張機能」→「Apps Script」を開きます。
3. [gas/Code.gs](gas/Code.gs) の内容を貼り付け、保存します。
4. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選びます。
5. 実行ユーザーを自分、アクセスできるユーザーを運用方針に合う設定にしてデプロイします。
6. 発行されたウェブアプリURLを `NEXT_PUBLIC_GAS_URL` に設定します。

初回回答時に次のヘッダーを自動作成します。

`回答日時 / 本日の来院目的 / 診療内容満足度 / スタッフ対応満足度 / 合計スコア / 平均スコア / 当院を選んだ理由 / 自由記述`

既存1行目がこの並びと異なる場合は誤った列への保存を防ぐためエラーにします。Apps Scriptはスプレッドシートに紐づけて使うため、Spreadsheet IDのハードコードはありません。

## Google口コミURL設定

Google Business Profileから取得した正規の口コミ投稿URLを `NEXT_PUBLIC_GOOGLE_REVIEW_URL` に設定し、アプリを再起動または再デプロイします。未設定時はエラーを出さずCTAを表示しません。架空URLは使用していません。

## 品質確認

```bash
npm test
npm run lint
npm run typecheck
npm audit
npm run build
git diff --check
```

## Vercel公開

1. このリポジトリをVercelへImportします。
2. Framework PresetにNext.js、Node.js 20.9以上を指定します。
3. Project SettingsのEnvironment Variablesへ、確定済みのGAS URLとGoogle口コミURLを登録します。
4. Productionへデプロイし、回答送信とGoogle Sheetsの追記を実データで確認します。

今回はVercel公開およびGitHub pushを実施していません。

## 質問・デザインの変更

- 質問文、形式、選択肢: `data/questions.ts`
- validation、スコア、payload: `lib/survey.ts`
- 医院情報、外部URL: `data/config.ts` と環境変数
- 配色: `tailwind.config.ts`
- 全体スタイル: `app/globals.css`

質問の追加・削除時はフォーム型、validation、payload、GASヘッダー・保存列、Unit testも同期してください。

## 現在の未設定項目

- Google口コミ投稿URL
- Googleスプレッドシート
- Google Apps ScriptウェブアプリURL

これらはすべて運用先確定後に設定できます。現在は架空値を含みません。
