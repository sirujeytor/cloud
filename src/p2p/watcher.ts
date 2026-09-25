import type { BrowserContext, Page } from "playwright";
import { config } from "../config.js";
import { notifyHuman } from "../notify/telegram.js";
import { findAutoReply, getFallbackReply } from "./autoReply.js";
import { selectors } from "./selectors.js";
import { loadState, saveState } from "./stateStore.js";
import type { BotState, ChatMessage, OpenOrder } from "./types.js";

async function readOpenOrders(page: Page): Promise<OpenOrder[]> {
  await page.goto(config.ordersUrl, { waitUntil: "domcontentloaded" });
  const rows = page.locator(selectors.orderRow);
  const count = await rows.count();

  const orders: OpenOrder[] = [];
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const orderId = (await row.locator(selectors.orderId).textContent())?.trim() ?? `row-${i}`;
    const counterparty =
      (await row.locator(selectors.counterpartyName).textContent())?.trim() ?? "desconocido";
    const statusText = (await row.locator(selectors.orderStatus).textContent())?.trim() ?? "";
    orders.push({
      orderId,
      counterparty,
      side: "unknown",
      statusText,
      detailUrl: page.url(),
    });
  }
  return orders;
}

function isPaidStatus(statusText: string): boolean {
  const normalized = statusText.toLowerCase();
  return selectors.paidStatusKeywords.some((kw) => normalized.includes(kw));
}

async function readChatMessages(page: Page, order: OpenOrder): Promise<ChatMessage[]> {
  const openChat = page.locator(selectors.openChatButton).first();
  if (await openChat.isVisible().catch(() => false)) {
    await openChat.click();
  }

  const items = page.locator(selectors.chatMessageItem);
  const count = await items.count();
  const messages: ChatMessage[] = [];
  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    const text = (await item.locator(selectors.chatMessageText).textContent())?.trim() ?? "";
    const fromCounterparty = (await item.getAttribute("data-from-counterparty")) === "true";
    messages.push({ id: `${order.orderId}-${i}`, fromCounterparty, text });
  }
  return messages;
}

async function sendChatReply(page: Page, reply: string): Promise<void> {
  const input = page.locator(selectors.chatInput);
  await input.fill(reply);
  await page.locator(selectors.chatSendButton).click();
}

async function processOrder(page: Page, order: OpenOrder, state: BotState): Promise<void> {
  const messages = await readChatMessages(page, order);

  for (const message of messages) {
    if (!message.fromCounterparty) continue;
    if (state.seenMessageIds.includes(message.id)) continue;

    const reply = (await findAutoReply(message.text)) ?? (await getFallbackReply());
    await sendChatReply(page, reply);
    state.seenMessageIds.push(message.id);
  }

  if (isPaidStatus(order.statusText) && !state.notifiedPaidOrderIds.includes(order.orderId)) {
    await notifyHuman(
      `Orden ${order.orderId} con ${order.counterparty} fue marcada como PAGADA.\n` +
        `Verifica que el dinero llego de verdad antes de liberar la operacion.\n` +
        order.detailUrl,
    );
    state.notifiedPaidOrderIds.push(order.orderId);
  }
}

export async function runWatchLoop(context: BrowserContext): Promise<never> {
  const page = await context.newPage();
  let state = await loadState();

  for (;;) {
    try {
      const orders = await readOpenOrders(page);
      for (const order of orders) {
        await processOrder(page, order, state);
      }
      await saveState(state);
    } catch (err) {
      console.error("Error revisando ordenes:", err);
    }
    await sleep(config.pollIntervalMs);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
