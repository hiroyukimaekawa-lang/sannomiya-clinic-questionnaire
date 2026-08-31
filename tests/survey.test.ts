import assert from 'node:assert/strict';
import test from 'node:test';
import { initialFormState, surveyQuestions, type SurveyFormState } from '../data/questions';
import { calculateScores, createSurveyPayload, hasValidationErrors, shouldShowReviewCta, validateSurvey } from '../lib/survey';

const completeForm: SurveyFormState = {
  visitPurpose: '検査のみ',
  medicalCareScore: '8',
  staffResponseScore: '9',
  reason: 'ホームページ',
  comments: '丁寧にご対応いただきました。',
};

test('質問文、回答形式、選択肢が仕様どおり', () => {
  assert.equal(surveyQuestions.length, 5);
  assert.deepEqual(surveyQuestions.map(({ type }) => type), ['single-choice', 'score-10', 'score-10', 'single-choice', 'textarea']);
  assert.deepEqual(surveyQuestions[0].options, ['検査のみ', '診察（外来）', '検査＋診察', 'その他']);
  assert.deepEqual(surveyQuestions[3].options, ['ホームページ', 'Googleマップ', 'クリニック紹介サイト', '看板', '知人紹介', '医療機関からの紹介']);
});

test('Q1〜Q4が未回答なら必須エラーになる', () => {
  const errors = validateSurvey(initialFormState);
  assert.deepEqual(Object.keys(errors), ['visitPurpose', 'medicalCareScore', 'staffResponseScore', 'reason']);
  assert.equal(errors.comments, undefined);
  assert.equal(hasValidationErrors(errors), true);
});

test('Q5は任意で、必須回答済みならエラーにならない', () => {
  const errors = validateSurvey({ ...completeForm, comments: '' });
  assert.deepEqual(errors, {});
  assert.equal(hasValidationErrors(errors), false);
});

test('Q2とQ3から合計と平均を計算する', () => {
  assert.deepEqual(calculateScores(completeForm), { totalScore: 17, averageScore: 8.5 });
});

test('GAS payloadに回答日時、回答、合計、平均を含む', () => {
  const payload = createSurveyPayload(completeForm, '2026-08-31T00:00:00.000Z');
  assert.deepEqual(payload, { ...completeForm, totalScore: 17, averageScore: 8.5, submittedAt: '2026-08-31T00:00:00.000Z' });
});

test('Google口コミCTAはURL未設定時だけ非表示になる', () => {
  assert.equal(shouldShowReviewCta(''), false);
  assert.equal(shouldShowReviewCta('   '), false);
  assert.equal(shouldShowReviewCta('x'), true);
});
