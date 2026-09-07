# Claude Code Project Instructions

作業開始前に必ず `JAPANESE_WEB_TYPOGRAPHY_SKILL.md` を読むこと。

## Japanese Web Typography

- 「ありがとうございまし / た。」のような語尾分断を残さない
- 助詞・句読点・1〜2文字の孤立を残さない
- 三宮胃腸内科など固有名詞を不自然に分断しない
- 日本語本文へ固定 `<br>` を乱用しない
- `word-break: break-all` を使わない
- `line-break: strict` / `word-break: normal` を基本とする
- 対応ブラウザでは `word-break: auto-phrase` を補助的に使用してよい

## Visual QA

最低限以下で実画面を確認する。

- 320px
- 375px
- 390px
- 430px
- 768px
- Desktop

Header / Hero / 全質問 / CTA / Thanks / Google口コミ案内まで確認し、不自然な改行があれば修正して再確認する。

## 完了前

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

## 口コミ表示条件

既存の「待ち時間9点以上 AND スタッフ対応9点以上」を維持する。合計点判定に変更しない。
