# 三宮胃腸内科 患者様アンケート 実装計画

## 調査結果

- 正式名称は「三宮胃腸内科」、業種は内科・消化器内科。公式サイトは白を基調に青緑系を用い、専門性と安心感を伝える構成。
- 公式サイトでは内科、消化器内科、胃・大腸内視鏡、健康診断、人間ドック等を案内している。
- 最優先参考の瓦谷クリニック版 `data/questions.ts` は、今回指定されたQ1〜Q5の質問文、形式、選択肢、順序と一致する。
- 瓦谷版の高得点者だけにGoogle口コミを案内する処理は今回の要件に反するため流用しない。
- Google口コミURL、Google Sheets、GAS URLはいずれも未設定。架空値を置かず、環境変数が空でもローカル確認可能にする。

## 瓦谷版から流用する部分

- Q1〜Q5の質問文、回答形式、選択肢、順序。
- 単一選択、1〜10評価、自由記述という基本UI。
- Next.js App Router、TypeScript、Tailwind CSSの構成。
- GASへJSONをPOSTし、Google Sheetsへ1回答1行で保存する考え方。
- 送信後に `/thanks` へ遷移する画面フロー。

## 三宮胃腸内科向けに変更する部分

- 医院名、説明文、メタデータ、GASの文言を三宮胃腸内科向けに変更。
- 公式サイトと指定色 `#5E969E` を参考に、白基調・十分な余白・高い可読性のモバイルUIにする。
- コンテンツ最大幅を430pxとし、375px・390px・430pxで横スクロールを発生させない。
- Q5に指定placeholder、1000文字上限、文字数表示を追加。
- Q2・Q3から合計と平均を算出し、送信payloadとGoogle Sheetsに含める。
- Google口コミCTAは点数で選別せず、URL設定時のみ全回答者へ同条件で表示する。
- GAS未設定時は外部送信を省略するローカルモードとする。
- 日本語バリデーション、二重送信防止、通信エラー表示、アクセシビリティを強化する。

## 技術構成

- Next.js 16 / App Router
- React / TypeScript
- Tailwind CSS 3
- Node標準テストランナー + tsx
- ESLint 9 + eslint-config-next
- Google Apps Script / Google Sheets
- Vercel対応環境変数

## ファイル構成

```text
app/
  globals.css
  layout.tsx
  page.tsx
  thanks/page.tsx
components/
  ChoiceGroup.tsx
  ClinicMark.tsx
  QuestionCard.tsx
  ScoreSelector.tsx
  TextAreaField.tsx
data/
  config.ts
  questions.ts
lib/
  survey.ts
gas/
  Code.gs
tests/
  survey.test.ts
.env.example
.gitignore
eslint.config.mjs
next.config.ts
package.json
postcss.config.js
tailwind.config.ts
tsconfig.json
README.md
```

## 実装手順

1. 設定、質問定義、型、validation・スコア・payload生成の純粋関数を作成する。
2. 430px幅のアンケート画面と各入力コンポーネントを実装する。
3. 送信状態、GAS送信、ローカルモード、sessionStorage、サンクス遷移を実装する。
4. Google口コミURLの有無に対応するサンクス画面を実装する。
5. Google Sheets連携用Apps Scriptを作成する。
6. Unit test、README、環境変数例を整備する。
7. npm install、Unit test、ESLint、TypeScript、npm audit、production buildを実行する。
8. ローカルサーバーでHTTP応答と、利用可能ならブラウザで375px・390px・430pxの表示・操作を確認する。
9. `git diff --check` と変更対象を確認する。

## テスト項目

- Q1・Q2・Q3・Q4の必須validationと設問付近の日本語エラー。
- Q2・Q3が1〜10で選択でき、横一列で収まること。
- Q1・Q4が単一選択で指定選択肢・順序どおりであること。
- Q5が任意、1000文字上限、文字数表示付きであること。
- 合計・平均スコアとGAS payloadが正しいこと。
- GAS URL未設定でも送信フローが完了すること。
- Google口コミURL未設定時はCTA非表示、設定時は点数に関係なくCTA表示となること。
- 送信中のdisabled表示と二重送信防止。
- 送信後に `/thanks` へ遷移すること。
- 375px・390px・430pxで横スクロールやレイアウト崩れがないこと。
- Unit test、ESLint、TypeScript、npm audit、production build、`git diff --check` が成功すること。
