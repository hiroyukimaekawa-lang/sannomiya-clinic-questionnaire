---
name: japanese-web-typography
description: 日本語アンケートUIの見出し・本文・CTA・質問・Thanks画面を、意味・自然さ・レスポンシブ表示を基準に整えるSkill。
---

# Japanese Web Typography Skill

## 目的

日本語Web UIの改行を、単純な文字数ではなく「意味」「日本語の自然さ」「デザイン」「レスポンシブ表示」で判断する。新規実装・既存修正・最終Visual QAで使用する。

## このリポジトリでの対象

- Headerの医院名
- Hero / H1 / subtitle
- 導入文
- 質問タイトル
- 必須・任意表示
- 選択肢
- 1〜10評価ラベル
- 送信CTA
- Thanks H1
- Thanks本文
- Google口コミ案内
- Google口コミCTA
- 戻るリンク

## 必須ルール

1. 文字数ではなく意味のまとまりで折り返す。
2. 本文は原則ブラウザの自然改行を使い、固定 `<br>` を乱用しない。
3. 助詞・句読点・1〜2文字だけを孤立させない。
4. `ありがとうございまし / た。`、`ため / に`、`こと / 。` のような文節・活用語尾の分断を残さない。
5. 医院名・店舗名・ブランド名は不自然に分断しない。
6. 日本語本文・見出しへ `word-break: break-all` を使わない。
7. 見出し・固有名詞へ `overflow-wrap: anywhere` を安易に使わない。自由入力の長文など緊急折り返しが必要な箇所に限定する。
8. 基本CSSは `line-break: strict; word-break: normal;` とする。
9. `text-wrap: balance` / `text-wrap: pretty` は補助として利用してよい。
10. 対応ブラウザでは `word-break: auto-phrase` をprogressive enhancementとして利用してよい。
11. `nowrap` は医院名や短い意味単位に限定し、長文全体へ適用しない。
12. Preview・本番・ThanksでTypographyルールを分離しない。

## Thanks画面の固定要件

以下のような表示は禁止。

```text
ご回答ありがとうございまし
た。
```

必要なら次のように短い意味単位で保持する。

```tsx
<h1 className="thanks-title jp-heading">
  <span className="thanks-title-phrase">ご回答</span>
  <span className="thanks-title-phrase">ありがとうございました。</span>
</h1>
```

本文や口コミ案内は、単なる見た目調整目的の `<br>` を入れず自然改行を優先する。

## Visual QA

コードだけで完了判定しない。最低限以下を実画面またはスクリーンショットで確認する。

- 320px
- 375px
- 390px
- 430px
- 768px
- Desktop

確認対象はHeaderからThanks・Google口コミCTAまで全件。問題があれば修正→再表示→再確認を繰り返す。

## 完了条件

- 日本語として自然な位置で折り返される
- 助詞・句読点・短語が孤立していない
- 医院名が不自然に分断されない
- Thanks H1の語尾が分断されない
- 固定 `<br>` の乱用がない
- 横スクロールがない
- 320 / 375 / 390 / 430pxで確認済み
- Tablet / Desktopでも確認済み
- `npm test` 成功
- `npm run lint` 成功
- `npm run typecheck` 成功
- `npm run build` 成功

## Google口コミ仕様

Typography修正では口コミ表示条件を変更しない。この案件の既存仕様である「待ち時間9点以上 AND スタッフ対応9点以上」の条件を維持する。
