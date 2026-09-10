'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clinicConfig, STORAGE_KEYS } from '@/data/config';
import { shouldShowReviewCta } from '@/lib/survey';

export default function ThanksPage() {
  const [isEligible, setIsEligible] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [copying, setCopying] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const hasReviewText = reviewText.trim().length > 0;

  async function copyReview(goToGoogle: boolean) {
    if (copying || !hasReviewText) return;
    setCopying(true);
    setCopyStatus('idle');
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch {
      setCopyStatus('error');
      setCopying(false);
      return;
    }
    setCopyStatus('success');
    setCopying(false);
    if (goToGoogle) {
      // Acknowledgement stays visible before same-tab navigation, including on mobile.
      window.alert('アンケートでご入力いただいた内容をコピーしました。Google口コミ画面で貼り付けてご利用ください。');
      window.location.assign(clinicConfig.googleReviewUrl);
    }
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setIsEligible(sessionStorage.getItem(STORAGE_KEYS.showReview) === '1');
        setReviewText(sessionStorage.getItem(STORAGE_KEYS.reviewText) ?? '');
      } catch {
        // Storage can be unavailable in restricted browser settings.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e6f1f1_0,#f4f8f8_34rem)] px-4 py-12">
      <section className="w-full max-w-[430px] rounded-[1.75rem] border border-primary/15 bg-white p-7 text-center shadow-card sm:p-9">
        <p className="clinic-name mb-2 text-sm font-bold tracking-[0.08em] text-primary-dark">三宮胃腸内科</p>
        <p className="jp-copy mb-5 text-xs tracking-[0.12em] text-slate-500">内科・消化器内科</p>
        <h1 className="thanks-title jp-heading text-2xl font-bold text-ink">
          <span className="thanks-title-phrase">ご回答</span>
          <span className="thanks-title-phrase">ありがとうございました。</span>
        </h1>
        <p className="thanks-lead jp-copy mt-5 text-sm leading-7 text-slate-600">
          いただいたご意見は、今後より良い診療環境づくりのために活用させていただきます。
        </p>

        {shouldShowReviewCta(clinicConfig.googleReviewUrl, isEligible) && (
          <div className="mt-7 border-t border-slate-100 pt-7">
            <p className="review-copy jp-copy mb-4 text-sm leading-6 text-slate-600">
              <span className="keep-phrase">よろしければ、</span>
              Googleでもご感想をお聞かせください。
            </p>
            {hasReviewText && (
              <div className="mb-4 text-left">
                <label htmlFor="review-text" className="jp-copy mb-2 block text-sm font-bold text-primary-dark">
                  アンケートでご記入いただいた内容
                </label>
                <textarea
                  id="review-text"
                  readOnly
                  value={reviewText}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-primary/20 bg-slate-50 p-3 text-base leading-7 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <p className="jp-copy mt-2 text-xs leading-5 text-slate-500">コピー後、Google口コミ画面で貼り付けてご利用ください。</p>
              </div>
            )}
            <p className="jp-copy mb-4 text-left text-xs leading-5 text-slate-600">
              Google口コミは一般公開されます。公開したくない情報が含まれている場合は、貼り付け後に内容を編集してから投稿してください。
            </p>
            {hasReviewText ? (
              <button
                type="button"
                disabled={copying}
                onClick={() => void copyReview(true)}
                className="jp-ui-label min-h-12 w-full rounded-full bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {copying ? 'コピーしています…' : '口コミ内容をコピーしてGoogleへ進む'}
              </button>
            ) : (
              <a
                href={clinicConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="jp-ui-label inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Googleで口コミを書く
              </a>
            )}
            {copyStatus === 'success' && (
              <p role="status" className="jp-copy mt-4 text-sm leading-6 text-primary-dark">
                アンケートでご入力いただいた内容をコピーしました。Google口コミ画面で貼り付けてご利用ください。
              </p>
            )}
            {copyStatus === 'error' && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p role="alert" className="jp-copy text-left text-sm leading-6 text-slate-600">
                  自動コピーできませんでした。再度コピーするか、上の文章を長押しして選択・コピーし、Google口コミ画面で貼り付けてください。
                </p>
                <button type="button" disabled={copying} onClick={() => void copyReview(false)} className="jp-ui-label mt-3 min-h-12 w-full rounded-full border border-primary px-4 py-3 text-sm font-bold text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  文章をコピーする
                </button>
                <a href={clinicConfig.googleReviewUrl} className="jp-ui-label mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Google口コミへ進む
                </a>
              </div>
            )}
          </div>
        )}

        <Link href="/" className="jp-ui-label mt-7 inline-block rounded-full px-5 py-3 text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4">アンケート画面に戻る</Link>
      </section>
    </main>
  );
}
