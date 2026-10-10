const RECOVERY_KEY = 'jb_asset_recovery_at';
const RECOVERY_COOLDOWN_MS = 120_000;

export function isAssetLoadError(error: { name?: string; message?: string }): boolean {
  return error.name === 'ChunkLoadError' ||
    /loading chunk .+ failed|failed to load chunk|failed to fetch dynamically imported module|importing a module script failed/i.test(error.message || '');
}

/** A stale installed app may request a chunk from a previous deployment. */
export function recoverAssetLoadError(
  error: { name?: string; message?: string },
  options: { storage: Storage; online: boolean; now: number; reload: () => void },
): boolean {
  if (!isAssetLoadError(error) || !options.online) return false;
  try {
    const last = Number(options.storage.getItem(RECOVERY_KEY));
    if (last > 0 && options.now - last < RECOVERY_COOLDOWN_MS) return false;
    options.storage.setItem(RECOVERY_KEY, String(options.now));
  } catch {
    // Without a persistent guard, an automatic reload could loop.
    return false;
  }
  options.reload();
  return true;
}
