# 三宮胃腸内科 患者様アンケート

三宮胃腸内科向けの匿名患者様アンケートです。Next.js App Router、TypeScript、Tailwind CSSで構築し、Google Apps Script経由でGoogle Sheetsへ回答を保存できます。GAS未設定時もローカルモードで入力、validation、スコア計算、サンクス画面まで確認できます。

## 質問内容

1. 本日のご来院目的（単一選択・必須）
2. 待ち時間の満足度（1〜10・必須）
3. スタッフ対応の満足度（1〜10・必須）
4. 当院を選んだ理由（単一選択・必須）
5. ご意見・ご要望（自由記述・任意・最大1000文字）

Q2とQ3から合計スコアと平均スコアを内部計算し、GAS送信payloadに含めます。Google口コミ案内は待ち時間とスタッフ対応の両方が9点以上の場合だけ表示します。氏名、電話番号、メールアドレス、住所は取得しません。

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
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL`: Google Business Profileの口コミ投稿URL。設定値を優先し、空の場合はコードに定義した三宮胃腸内科のURLを使用します。
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

既存1行目がこの並びと異なる場合は誤った列への保存を防ぐためエラーにします。フロントは待ち時間を `waitingTimeScore` として扱いつつ、現在稼働中のGASとの互換性のため同じ値を `medicalCareScore` にも入れて送信します。Apps Scriptはスプレッドシートに紐づけて使うため、Spreadsheet IDのハードコードはありません。

## Google口コミURL設定

環境ごとに別の口コミ先を使う場合は `NEXT_PUBLIC_GOOGLE_REVIEW_URL` に設定し、アプリを再起動または再デプロイします。未設定時は、三宮胃腸内科の指定Google口コミURLを使用します。

## 自由記述の口コミへの再利用

- 送信後、⑤の原文を `sessionStorage` の `sannomiya-clinic-review-text` に保存します。次の回答送信時は空欄も含めて上書きし、以前の文章を使い回しません。タブを閉じるまでの一時保持で、`localStorage` は使用しません。
- 既存の「待ち時間9点以上 AND スタッフ対応9点以上」を満たす場合だけ口コミ導線を表示します。
- 自由記述がある場合は、完了画面に選択・コピー可能な原文を表示します。「口コミ内容をコピーしてGoogleへ進む」で `navigator.clipboard.writeText()` を実行し、コピー成功のダイアログを確認すると同じタブで設定済みGoogle URLへ進みます。非同期コピー後のポップアップ制限を避ける構成です。
- コピーに失敗した場合は完了画面に留まり、原文・再コピー・Googleへの手動遷移を表示します。文章の長押しによる手動コピーも可能です。
- 空欄・空白のみの場合は従来のGoogle口コミリンクを表示し、コピーしません。
- Google画面へ直接入力・自動投稿は行いません。ユーザーが貼り付け・編集し、公開する内容を決めます。
- Clipboard APIにはHTTPS（開発時はlocalhost）が必要です。ブラウザの権限や設定で使えない場合も上記フォールバックを使用できます。

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

## 質問・デザインの変更

- 質問文、形式、選択肢: `data/questions.ts`
- validation、スコア、payload: `lib/survey.ts`
- 医院情報、外部URL: `data/config.ts` と環境変数
- 配色: `tailwind.config.ts`
- 全体スタイル: `app/globals.css`

質問の追加・削除時はフォーム型、validation、payload、GASヘッダー・保存列、Unit testも同期してください。

GoogleスプレッドシートとGoogle Apps ScriptウェブアプリURLは、運用環境で設定してください。
