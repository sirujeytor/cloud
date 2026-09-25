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

  // Palabras que indican un control de "saltar" real, ya habilitado.
  const SKIP_WORD = /\b(skip|saltar|omitir)\b/i;
  // Si el texto todavia incluye la cuenta atras ("en 5 segundos", "in 5s",
  // "5s"), el control aun no es clickeable de verdad: hay que esperar a
  // que el texto cambie (o el numero llegue a 0 y desaparezca).
  const STILL_COUNTING = /\d+\s*(segundos?|seconds?|\bs\b)/i;

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

  function isReadySkipText(text) {
    return text.length > 0 && text.length < 40 && SKIP_WORD.test(text) && !STILL_COUNTING.test(text);
  }

  function findBySelector() {
    for (const selector of SKIP_SELECTORS) {
      const el = document.querySelector(selector);
      if (looksClickable(el)) return el;
    }
    return null;
  }

  // Barrido amplio por texto: cubre players con markup propio (divs/spans
  // sin clase reconocible). Es mas costoso, por eso se llama solo desde
  // el intervalo, no en cada mutacion del DOM.
  function findByText() {
    const candidates = document.querySelectorAll("button, a, div, span");
    for (const el of candidates) {
      if (el.children.length > 2) continue; // evita contenedores grandes
      const text = (el.textContent || "").trim();
      if (isReadySkipText(text) && looksClickable(el)) return el;
    }
    return null;
  }

  function click(el) {
    el.dataset.__adblockSkipped = "1";
    el.click();
  }

  function fastCheck() {
    const el = findBySelector();
    if (el) click(el);
  }

  function fullCheck() {
    const el = findBySelector() || findByText();
    if (el) click(el);
  }

  const observer = new MutationObserver(fastCheck);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

  // El barrido por texto corre cada segundo: alcanza para no perderse la
  // ventana en la que el boton pasa de "cuenta atras" a "clickeable".
  setInterval(fullCheck, 1000);
})();
