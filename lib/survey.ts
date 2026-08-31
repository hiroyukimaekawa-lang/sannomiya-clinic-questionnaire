import { surveyQuestions, type SurveyFormErrors, type SurveyFormState } from '@/data/questions';

export interface SurveyPayload extends SurveyFormState {
  submittedAt: string;
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

export function calculateScores(form: Pick<SurveyFormState, 'medicalCareScore' | 'staffResponseScore'>) {
  const medicalCareScore = Number(form.medicalCareScore);
  const staffResponseScore = Number(form.staffResponseScore);
  const totalScore = medicalCareScore + staffResponseScore;

  return { totalScore, averageScore: totalScore / 2 };
}

export function createSurveyPayload(form: SurveyFormState, submittedAt = new Date().toISOString()): SurveyPayload {
  return { ...form, ...calculateScores(form), submittedAt };
}

export function shouldShowReviewCta(reviewUrl: string): boolean {
  return reviewUrl.trim().length > 0;
}
