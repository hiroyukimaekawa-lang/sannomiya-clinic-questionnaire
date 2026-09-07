'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChoiceGroup } from '@/components/ChoiceGroup';
import { ClinicMark } from '@/components/ClinicMark';
import { QuestionCard } from '@/components/QuestionCard';
import { ScoreSelector } from '@/components/ScoreSelector';
import { TextAreaField } from '@/components/TextAreaField';
import { clinicConfig, STORAGE_KEYS } from '@/data/config';
import { initialFormState, surveyQuestions, type SurveyFormErrors, type SurveyFormState } from '@/data/questions';
import { createSurveyPayload, hasValidationErrors, isGoogleReviewEligible, validateSurvey } from '@/lib/survey';

export default function SurveyPage() {
  const router = useRouter();
  const [form, setForm] = useState<SurveyFormState>(initialFormState);
  const [errors, setErrors] = useState<SurveyFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function updateField(field: keyof SurveyFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validateSurvey(form);
    if (hasValidationErrors(nextErrors)) {
      setErrors(nextErrors);
      requestAnimationFrame(() => document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const payload = createSurveyPayload(form);

    try {
      if (clinicConfig.gasUrl) {
        await fetch(clinicConfig.gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });
      }

      sessionStorage.setItem(
        STORAGE_KEYS.showReview,
        isGoogleReviewEligible(Number(form.waitingTimeScore), Number(form.staffResponseScore)) ? '1' : '0',
      );
      router.push('/thanks');
    } catch {
      setSubmitError('送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e6f1f1_0,#f4f8f8_34rem)] px-4 pb-16">
      <div className="mx-auto w-full max-w-[430px]">
        <header className="flex items-center justify-center gap-3 py-5">
          <ClinicMark className="h-10 w-10" />
          <div className="text-center">
            <p className="clinic-name jp-heading text-lg font-bold tracking-[0.08em] text-primary-dark">三宮胃腸内科</p>
            <p className="jp-copy text-xs tracking-[0.12em] text-slate-500">内科・消化器内科</p>
          </div>
        </header>

        <section className="mb-5 overflow-hidden rounded-[1.75rem] bg-primary px-6 py-9 text-center text-white shadow-card">
          <p className="mb-2 text-xs font-bold tracking-[0.24em] text-white/80">PATIENT QUESTIONNAIRE</p>
          <h1 className="jp-heading text-2xl font-bold tracking-[0.08em]">患者様アンケート</h1>
          <div className="mx-auto my-5 h-px w-12 bg-white/55" />
          <p className="intro-copy jp-copy text-sm leading-7 text-white/95">
            <span className="intro-line">本日は三宮胃腸内科へご来院いただきありがとうございます。</span>
            <span className="intro-line">今後の診療・サービス改善のため、アンケートへのご協力をお願いいたします。</span>
          </p>
        </section>

        <aside className="jp-copy mb-6 rounded-2xl border border-primary/15 bg-white/85 px-5 py-4 text-sm leading-6 text-slate-600">
          <p className="font-bold text-primary-dark">匿名でご回答いただけます</p>
          <p>いただいた内容は、診療・サービス改善のために活用いたします。</p>
        </aside>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {surveyQuestions.map((question) => {
            const value = form[question.id];
            const error = errors[question.id];
            return (
              <QuestionCard key={question.id} title={question.title} required={question.required} error={error}>
                {question.type === 'single-choice' && question.options && (
                  <ChoiceGroup name={question.id} label={question.title} options={question.options} value={value} onChange={(answer) => updateField(question.id, answer)} hasError={Boolean(error)} />
                )}
                {question.type === 'score-10' && (
                  <ScoreSelector name={question.id} label={question.title} value={value ? Number(value) : null} onChange={(score) => updateField(question.id, String(score))} hasError={Boolean(error)} />
                )}
                {question.type === 'textarea' && (
                  <TextAreaField id={question.id} value={value} placeholder={question.placeholder} onChange={(answer) => updateField(question.id, answer)} />
                )}
              </QuestionCard>
            );
          })}

          {submitError && <p role="alert" className="jp-copy rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-error">{submitError}</p>}

          <button type="submit" disabled={submitting} className="jp-ui-label min-h-14 w-full rounded-full bg-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? '送信しています…' : 'アンケートを送信する'}
          </button>
          <p className="jp-copy text-center text-xs leading-5 text-slate-500">回答の送信により個人を特定する情報は収集しません。</p>
        </form>
      </div>
    </main>
  );
}
