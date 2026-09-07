'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClinicMark } from '@/components/ClinicMark';
import { clinicConfig, STORAGE_KEYS } from '@/data/config';
import { shouldShowReviewCta } from '@/lib/survey';

export default function ThanksPage() {
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsEligible(sessionStorage.getItem(STORAGE_KEYS.showReview) === '1');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e6f1f1_0,#f4f8f8_34rem)] px-4 py-12">
      <section className="w-full max-w-[430px] rounded-[1.75rem] border border-primary/15 bg-white p-7 text-center shadow-card sm:p-9">
        <ClinicMark className="mx-auto mb-5 h-16 w-16" />
        <p className="mb-2 text-sm font-bold tracking-[0.08em] text-primary-dark">三宮胃腸内科</p>
        <h1 className="text-2xl font-bold text-ink">ご回答ありがとうございました。</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          いただいたご意見は、<br />今後より良い診療環境づくりのために<br />活用させていただきます。
        </p>

        {shouldShowReviewCta(clinicConfig.googleReviewUrl, isEligible) && (
          <div className="mt-7 border-t border-slate-100 pt-7">
            <p className="mb-4 text-sm leading-6 text-slate-600">よろしければ、<br />Googleでもご感想をお聞かせください。</p>
            <a href={clinicConfig.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              Googleで口コミを書く
            </a>
          </div>
        )}

        <Link href="/" className="mt-7 inline-block rounded-full px-5 py-3 text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4">アンケート画面に戻る</Link>
      </section>
    </main>
  );
}
