import { revalidatePath, revalidateTag } from 'next/cache';
import { safeCompare } from '@/lib/security';
import { SANITY_TAGS } from '@/sanity/lib/client';

const TYPE_TO_TAGS: Record<string, readonly string[]> = {
  portfolio: [SANITY_TAGS.portfolio],
  testimonial: [SANITY_TAGS.testimonials],
  comparison: [SANITY_TAGS.comparisons],
  brand: [SANITY_TAGS.brands],
  post: [SANITY_TAGS.post],
};

const MAX_EXPLICIT_PATHS = 6;

export type RevalidatePayload = {
  _type?: string;
  slug?: string | { current?: string };
  tags?: string[];
  paths?: string[];
};

export function isAuthorizedRevalidateRequest(request: Request): boolean {
  const secrets = [
    process.env.REVALIDATE_SECRET,
    process.env.CRON_SECRET,
    process.env.AMOCRM_CRON_SECRET,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  if (secrets.length === 0) return false;

  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    if (token && secrets.some((secret) => safeCompare(token, secret))) {
      return true;
    }
  }

  const webhookSecret = (
    request.headers.get('x-sanity-webhook-secret') ||
    request.headers.get('x-webhook-secret') ||
    ''
  ).trim();
  const revalidateSecret = process.env.REVALIDATE_SECRET?.trim();
  return Boolean(revalidateSecret && webhookSecret && safeCompare(webhookSecret, revalidateSecret));
}

export function resolveRevalidationTargets(payload: RevalidatePayload): {
  tags: string[];
  paths: string[];
} {
  const tags = new Set<string>();
  const paths = new Set<string>();

  if (payload._type && TYPE_TO_TAGS[payload._type]) {
    for (const tag of TYPE_TO_TAGS[payload._type]) tags.add(tag);
  }
  if (Array.isArray(payload.tags)) {
    for (const tag of payload.tags) {
      if (typeof tag === 'string' && tag.trim()) tags.add(tag.trim());
    }
  }
  if (tags.size === 0) {
    tags.add(SANITY_TAGS.all);
  }

  // Pages already carry `sanity:<type>` tags via sanityFetch, so 1 tag invalidation covers all locales/routes
  // without fanning out 20+ concurrent DO RPCs inside a single Worker request. Explicit paths remain opt-in.
  if (Array.isArray(payload.paths)) {
    for (const path of payload.paths) {
      if (paths.size >= MAX_EXPLICIT_PATHS) break;
      if (typeof path === 'string' && path.startsWith('/')) paths.add(path);
    }
  }

  return { tags: Array.from(tags), paths: Array.from(paths) };
}

/** Marks Sanity cache tags (and bounded explicit paths, if any) stale across DO tag cache and KV. */
export function revalidateSanityContent(payload: RevalidatePayload) {
  const { tags, paths } = resolveRevalidationTargets(payload);
  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }
  for (const path of paths) {
    revalidatePath(path, 'page');
  }
  return { tags, paths };
}
