export const clinicConfig = {
  name: '三宮胃腸内科',
  industry: '内科・消化器内科',
  homepageUrl: 'https://sannomiya-clinic.com/',
  gasUrl: process.env.NEXT_PUBLIC_GAS_URL?.trim() ?? '',
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() ?? '',
} as const;
