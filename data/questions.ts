export type QuestionType = 'single-choice' | 'score-10' | 'textarea';

export interface Question {
  id: keyof SurveyFormState;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: readonly string[];
  placeholder?: string;
}

export interface SurveyFormState {
  visitPurpose: string;
  medicalCareScore: string;
  staffResponseScore: string;
  reason: string;
  comments: string;
}

export const initialFormState: SurveyFormState = {
  visitPurpose: '',
  medicalCareScore: '',
  staffResponseScore: '',
  reason: '',
  comments: '',
};

export type SurveyFormErrors = Partial<Record<keyof SurveyFormState, string>>;

export const surveyQuestions: readonly Question[] = [
  {
    id: 'visitPurpose',
    type: 'single-choice',
    title: '①本日のご来院目的を教えてください。',
    options: ['検査のみ', '診察（外来）', '検査＋診察', 'その他'],
    required: true,
  },
  {
    id: 'medicalCareScore',
    type: 'score-10',
    title: '②診療内容は満足できましたか',
    required: true,
  },
  {
    id: 'staffResponseScore',
    type: 'score-10',
    title: '③スタッフの対応は満足できましたか',
    required: true,
  },
  {
    id: 'reason',
    type: 'single-choice',
    title: '④当院を選ばれた理由は？',
    options: [
      'ホームページ',
      'Googleマップ',
      'クリニック紹介サイト',
      '看板',
      '知人紹介',
      '医療機関からの紹介',
    ],
    required: true,
  },
  {
    id: 'comments',
    type: 'textarea',
    title: '⑤その他、お気づきの点や改善点、ご意見ご要望などございましたらお聞かせください。',
    placeholder:
      '診療やスタッフ対応、院内環境などについて、\nお気づきの点がございましたらご自由にご記入ください。',
    required: false,
  },
];
