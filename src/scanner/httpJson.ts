function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrapper de fetch con reintentos y backoff exponencial. Cualquier error de
 * red o respuesta no-2xx se reintenta hasta `retries` veces antes de tirar
 * el error definitivo.
 */
export async function fetchJsonWithRetry<T>(
  url: string,
  init?: RequestInit,
  retries = 3,
  baseDelayMs = 500,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} en ${url}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(baseDelayMs * 2 ** attempt);
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
