export const SANITY_WRITE_TOKEN_ENV = 'SANITY_API_WRITE_TOKEN';

type SanityErrorLike = {
  message?: unknown;
  statusCode?: unknown;
  response?: {
    status?: unknown;
    statusCode?: unknown;
  };
};

export type SanityWriteDiagnostic = {
  code: 'SANITY_WRITE_UNAUTHORIZED' | 'SANITY_WRITE_FORBIDDEN';
  message: string;
  hint: string;
  status: 503;
};

export function getSanityWriteToken(
  env: Readonly<Record<string, string | undefined>> = process.env,
): string | null {
  const token = env[SANITY_WRITE_TOKEN_ENV]?.trim();
  return token || null;
}

export function getSanityWriteDiagnostic(
  error: unknown,
): SanityWriteDiagnostic | null {
  const candidate =
    typeof error === 'object' && error !== null
      ? (error as SanityErrorLike)
      : {};
  const status =
    candidate.statusCode ??
    candidate.response?.statusCode ??
    candidate.response?.status;
  const message =
    typeof candidate.message === 'string' ? candidate.message : '';

  if (status === 401 || /\bunauthori[sz]ed\b/i.test(message)) {
    return {
      code: 'SANITY_WRITE_UNAUTHORIZED',
      message: 'Sanity yozish tokenini qabul qilmadi.',
      hint: `${SANITY_WRITE_TOKEN_ENV} qiymatini yangi Sanity Editor tokeni bilan almashtiring va Vercel Production'ni redeploy qiling.`,
      status: 503,
    };
  }

  if (
    status === 403 ||
    /permission.*create|insufficient permissions|forbidden/i.test(message)
  ) {
    return {
      code: 'SANITY_WRITE_FORBIDDEN',
      message: 'Sanity tokenida post yaratish ruxsati yo‘q.',
      hint: `${SANITY_WRITE_TOKEN_ENV} uchun Viewer emas, production datasetga yozish huquqiga ega Editor tokenini kiriting va redeploy qiling.`,
      status: 503,
    };
  }

  return null;
}
