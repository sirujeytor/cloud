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
    "#skipAdButton",
    ".skipAd a",
    ".skipAd button",
    ".skipAdContainer button",
  ];

  // Palabras que indican un control de "saltar" real, ya habilitado.
  const SKIP_WORD = /\b(skip|saltar|omitir)\b/i;
  // Si el texto todavia incluye la cuenta atras ("en 5 segundos", "in 5s",
  // "5s"), el control aun no es clickeable de verdad: hay que esperar a
  // que el texto cambie (o el numero llegue a 0 y desaparezca).
  const STILL_COUNTING = /\d+\s*(segundos?|seconds?|\bs\b)/i;

  // Patron muy comun: el texto del boton NO cambia ("Saltar anuncio"
  // se queda fijo) y lo que cambia es que se le sacan el atributo
  // "disabled" o una clase "disabled"/"is-disabled" cuando termina la
  // cuenta atras (que vive en un elemento hermano separado, tipo
  // <span id="skipAdCountdown">5</span>). Si no se chequea esto, el
  // boton se clickea (sin efecto) apenas aparece, se marca como
  // "resuelto" y nunca se reintenta cuando de verdad se habilita.
  function isDisabled(el) {
    if (el.disabled) return true;
    if (el.getAttribute?.("aria-disabled") === "true") return true;
    const cls = el.className;
    if (typeof cls === "string" && /\b(is-)?disabled\b/i.test(cls)) return true;
    return false;
  }

  function looksClickable(el) {
    if (!el || el.dataset.__adblockSkipped || isDisabled(el)) return false;
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

  // Recorre el DOM incluyendo shadow roots abiertos: muchos reproductores
  // dibujan sus controles (skip, cuenta atras) dentro de un componente
  // web con Shadow DOM, que querySelectorAll normal no atraviesa.
  function* deepWalk(root) {
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (node.shadowRoot) stack.push(node.shadowRoot);
      const children = node.children || [];
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i]);
        yield children[i];
      }
    }
  }

  function findSkipTarget() {
    let textCandidate = null;
    for (const el of deepWalk(document.documentElement)) {
      for (const selector of SKIP_SELECTORS) {
        if (el.matches?.(selector) && looksClickable(el)) return el;
      }
      if (!textCandidate) {
        const tag = el.tagName;
        if (tag === "BUTTON" || tag === "A" || tag === "DIV" || tag === "SPAN") {
          if (el.children.length <= 2) {
            const text = (el.textContent || "").trim();
            if (isReadySkipText(text) && looksClickable(el)) textCandidate = el;
          }
        }
      }
    }
    return textCandidate;
  }

  function click(el) {
    el.dataset.__adblockSkipped = "1";
    el.click();
  }

  function check() {
    const el = findSkipTarget();
    if (el) click(el);
  }

  // Debounce: el barrido recorre todo el DOM (incluyendo shadow roots),
  // asi que no conviene correrlo en cada mutacion suelta si la pagina
  // muta seguido (ej. contadores, animaciones).
  let scheduled = false;
  function scheduleCheck() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      check();
    }, 250);
  }

  const observer = new MutationObserver(scheduleCheck);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

  // Fallback por si el cambio no dispara una mutacion visible para el
  // observer (ej. un shadow root cerrado actualizando su propio interior,
  // o un cambio de estilo que no toca atributos del elemento).
  setInterval(check, 1000);
})();
