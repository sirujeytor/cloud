const toggle = document.getElementById("toggle");
const statusLabel = document.getElementById("status-label");
const countEl = document.getElementById("count");
const resetBtn = document.getElementById("reset");
const warningCard = document.getElementById("incognito-warning");
const openSettingsBtn = document.getElementById("open-settings");

function render(status) {
  toggle.checked = status.enabled;
  statusLabel.textContent = status.enabled ? "Activo" : "Desactivado";
  countEl.textContent = status.blockedCount;
}

async function refresh() {
  const status = await chrome.runtime.sendMessage({ type: "GET_STATUS" });
  render(status);
}

toggle.addEventListener("change", async () => {
  const status = await chrome.runtime.sendMessage({
    type: "SET_ENABLED",
    enabled: toggle.checked,
  });
  if (status?.ok) refresh();
});

resetBtn.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "RESET_COUNT" });
  refresh();
});

openSettingsBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
});

chrome.extension.isAllowedIncognitoAccess((allowed) => {
  warningCard.classList.toggle("hidden", allowed);
});

refresh();
