const RULESET_ID = "ruleset_ads";
const STORAGE_KEY = "blockedCount";

async function getBlockedCount() {
  const { [STORAGE_KEY]: count } = await chrome.storage.local.get(STORAGE_KEY);
  return count || 0;
}

async function bumpBadge() {
  const count = await getBlockedCount();
  const text = count > 9999 ? "9999+" : String(count);
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: "#2dd4bf" });
}

// Solo se dispara en extensiones cargadas como "descomprimidas" (nuestro caso):
// sirve para contar bloqueos sin pedir permisos invasivos de red.
if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async () => {
    const count = await getBlockedCount();
    await chrome.storage.local.set({ [STORAGE_KEY]: count + 1 });
    bumpBadge();
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(STORAGE_KEY).then((data) => {
    if (data[STORAGE_KEY] === undefined) {
      chrome.storage.local.set({ [STORAGE_KEY]: 0 });
    }
  });
  bumpBadge();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SET_ENABLED") {
    chrome.declarativeNetRequest
      .updateEnabledRulesets({
        enableRulesetIds: message.enabled ? [RULESET_ID] : [],
        disableRulesetIds: message.enabled ? [] : [RULESET_ID],
      })
      .then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message?.type === "GET_STATUS") {
    Promise.all([
      chrome.declarativeNetRequest.getEnabledRulesets(),
      getBlockedCount(),
    ]).then(([enabledRulesets, blockedCount]) => {
      sendResponse({
        enabled: enabledRulesets.includes(RULESET_ID),
        blockedCount,
      });
    });
    return true;
  }
  if (message?.type === "RESET_COUNT") {
    chrome.storage.local.set({ [STORAGE_KEY]: 0 }).then(() => {
      bumpBadge();
      sendResponse({ ok: true });
    });
    return true;
  }
});
