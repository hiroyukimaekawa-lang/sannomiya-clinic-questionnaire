import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(join(import.meta.dirname, '..', path), 'utf8');

test('Thanks見出しは語尾を分断しない意味単位で保持する', () => {
  const page = read('app/thanks/page.tsx');
  assert.match(page, /thanks-title-phrase">ご回答<\/span>/);
  assert.match(page, /thanks-title-phrase">ありがとうございました。<\/span>/);
  assert.doesNotMatch(page, /いただいたご意見は、<br/);
  assert.doesNotMatch(page, /よろしければ、<br/);
});

test('日本語Typography CSSは禁則とauto-phraseを採用する', () => {
  const css = read('app/globals.css');
  assert.match(css, /line-break:\s*strict/);
  assert.match(css, /word-break:\s*normal/);
  assert.match(css, /@supports \(word-break: auto-phrase\)/);
  assert.match(css, /word-break:\s*auto-phrase/);
  assert.match(css, /text-wrap:\s*balance/);
  assert.match(css, /text-wrap:\s*pretty/);
  assert.doesNotMatch(css, /word-break:\s*break-all/);
  assert.doesNotMatch(css, /overflow-wrap:\s*anywhere/);
});

test('公開画面の主要コピー・質問・選択肢へ共通Typography classを適用する', () => {
  const page = read('app/page.tsx');
  const questionCard = read('components/QuestionCard.tsx');
  const choiceGroup = read('components/ChoiceGroup.tsx');
  const scoreSelector = read('components/ScoreSelector.tsx');
  assert.match(page, /clinic-name jp-heading/);
  assert.match(page, /intro-copy jp-copy/);
  assert.match(page, /jp-ui-label min-h-14/);
  assert.match(questionCard, /className="jp-heading/);
  assert.match(choiceGroup, /className="jp-copy min-w-0"/);
  assert.match(scoreSelector, /className="whitespace-nowrap">非常に不満/);
  assert.match(scoreSelector, /className="whitespace-nowrap">非常に満足/);
});
