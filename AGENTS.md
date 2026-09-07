# Coding Agent Instructions

このリポジトリをCodex等のコーディングエージェントで変更する場合、作業開始前に必ず以下を読むこと。

- `JAPANESE_WEB_TYPOGRAPHY_SKILL.md`
- `README.md`

## UI変更の必須ルール

- mobile first
- Header / Hero / 質問 / CTA / Thanks / Google口コミ案内まで全件確認する
- 日本語の意味途中・語尾で不自然に折り返さない
- 本文の固定 `<br>` を乱用しない
- `word-break: break-all` を日本語へ使わない
- 医院名や短い意味単位以外に長い `nowrap` を使わない
- 320 / 375 / 390 / 430 / 768px / DesktopでVisual QAする

## 完了前コマンド

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

コードが通るだけでは完了ではない。実画面の日本語表示まで確認すること。

## Google口コミ条件

既存仕様を維持する。

```text
待ち時間 >= 9
AND
スタッフ対応 >= 9
```

合計点による判定へ変更しない。
