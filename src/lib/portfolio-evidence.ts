export type PortfolioResult = { metric: string; value: string; sourceUrl?: string; period?: string; approved?: boolean };

// Old CMS metrics lack provenance. Publish only reviewed, attributable results.
export function publicPortfolioResults(results?: PortfolioResult[]): PortfolioResult[] {
  return (Array.isArray(results) ? results : []).filter((result) => {
    if (!result || !result.approved || typeof result.metric !== 'string' || !result.metric.trim() || typeof result.value !== 'string' || !result.value.trim() || !result.period?.trim()) return false;
    try { return ['https:', 'http:'].includes(new URL(result.sourceUrl || '').protocol); }
    catch { return false; }
  });
}
