import { surveyQuestions, type SurveyFormErrors, type SurveyFormState } from '@/data/questions';

export interface SurveyPayload extends SurveyFormState {
  clinicKey: 'sannomiya';
  submittedAt: string;
  /** Kept for compatibility with the currently deployed GAS. */
  medicalCareScore: string;
  totalScore: number;
  averageScore: number;
}

export function validateSurvey(form: SurveyFormState): SurveyFormErrors {
  const errors: SurveyFormErrors = {};

  for (const question of surveyQuestions) {
    if (question.required && !form[question.id].trim()) {
      errors[question.id] = 'こちらの項目をご回答ください';
    }
  }

  return errors;
}

export function hasValidationErrors(errors: SurveyFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function calculateScores(form: Pick<SurveyFormState, 'waitingTimeScore' | 'staffResponseScore'>) {
  const waitingTimeScore = Number(form.waitingTimeScore);
  const staffResponseScore = Number(form.staffResponseScore);
  const totalScore = waitingTimeScore + staffResponseScore;

  return { totalScore, averageScore: totalScore / 2 };
}

export function createSurveyPayload(form: SurveyFormState, submittedAt = new Date().toISOString()): SurveyPayload {
  return {
    clinicKey: 'sannomiya',
    ...form,
    medicalCareScore: form.waitingTimeScore,
    ...calculateScores(form),
    submittedAt,
  };
}

export function isGoogleReviewEligible(waitingTimeScore: number, staffResponseScore: number): boolean {
  return waitingTimeScore >= 9 && staffResponseScore >= 9;
}

export function shouldShowReviewCta(reviewUrl: string, isEligible: boolean): boolean {
  return reviewUrl.trim().length > 0 && isEligible;
}
