/** Bounded streaming read: Content-Length is optional and cannot be trusted. */
export async function readChatBody(request: Request, limit = 8192): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > limit) throw new RangeError('body too large');
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError('missing body');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new RangeError('body too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

/** Scanner noise filter only; never a substitute for safe downstream APIs. */
export function isChatProbe(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2 || /^(?:testing|555-666-0606)$/i.test(trimmed)) return true;
  if ((trimmed.match(/[\p{L}\p{N}]/gu)?.length || 0) < 2) return true;
  return /\b(?:print|echo|eval|assert|system|exec|passthru|shell_exec)\s*\(/i.test(text)
    || /<\?(?:php|=)|\$\{\s*@|\bunion\s+(?:all\s+)?select\b/i.test(text)
    || /\bdfb[\s\S]{0,80}xca\b|98991\s*\*\s*97996|198766\s*\*\s*667891|\{\{[\s\S]*?\}\}|#set\s*\(/i.test(text);
}
