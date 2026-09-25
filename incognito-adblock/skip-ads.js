// Detecta y clickea automaticamente el boton "Saltar anuncio" de
// reproductores de video (IMA SDK, JW Player, Video.js y variantes).
// No puede evitar los primeros segundos obligatorios antes de que el
// boton se habilite: eso lo define el servidor de anuncios, no el
// reproductor, y no hay forma de saltarlo sin romper el player.
(() => {
  const SKIP_SELECTORS = [
    ".ima-skip-button",
    ".videoAdUiSkipButton",
    ".vjs-ad-skip-button",
    '[class*="skip-ad" i]',
    '[class*="skip_ad" i]',
    '[class*="ad-skip" i]',
    '[id*="skip-button" i]',
    "button.skip-button",
    ".jw-skip",
  ];

  const TEXT_PATTERNS = [/skip ad/i, /saltar anuncio/i, /saltar publicidad/i, /omitir anuncio/i];

  function looksClickable(el) {
    if (!el || el.dataset.__adblockSkipped) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none" || style.pointerEvents === "none") {
      return false;
    }
    return true;
  }

  function findSkipButton() {
    for (const selector of SKIP_SELECTORS) {
      const el = document.querySelector(selector);
      if (looksClickable(el)) return el;
    }
    const candidates = document.querySelectorAll("button, div[role='button'], span[role='button'], a");
    for (const el of candidates) {
      const text = (el.textContent || "").trim();
      if (text.length > 0 && text.length < 40 && TEXT_PATTERNS.some((re) => re.test(text)) && looksClickable(el)) {
        return el;
      }
    }
    return null;
  }

  function tryClickSkip() {
    const btn = findSkipButton();
    if (btn) {
      btn.dataset.__adblockSkipped = "1";
      btn.click();
    }
  }

  const observer = new MutationObserver(() => tryClickSkip());
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

  // Fallback por si el boton aparece sin disparar una mutacion visible
  // (ej. solo cambia una clase que oculta/muestra via CSS externo).
  setInterval(tryClickSkip, 1000);
})();
