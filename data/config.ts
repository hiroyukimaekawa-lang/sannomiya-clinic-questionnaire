export const DEFAULT_GOOGLE_REVIEW_URL =
  'https://www.google.com/search?q=%E4%B8%89%E5%AE%AE%E8%83%83%E8%85%B8%E5%86%85%E7%A7%91&oq=%E4%B8%89%E5%AE%AE%E8%83%83%E8%85%B8%E5%86%85%E7%A7%91&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIKCAQQABiABBiiBDIGCAUQRRg90gEHNDQ1ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x3538b71c0287047f:0xc6b54829783b8e48,3,,,,';

export function resolveGoogleReviewUrl(configuredUrl: string | undefined) {
  return configuredUrl?.trim() || DEFAULT_GOOGLE_REVIEW_URL;
}

export const clinicConfig = {
  name: '三宮胃腸内科',
  industry: '内科・消化器内科',
  homepageUrl: 'https://sannomiya-clinic.com/',
  gasUrl: process.env.NEXT_PUBLIC_GAS_URL?.trim() ?? '',
  googleReviewUrl: resolveGoogleReviewUrl(process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL),
} as const;

export const STORAGE_KEYS = {
  showReview: 'sannomiya-clinic-show-review',
} as const;
