/**
 * Binance cambia el HTML de la web seguido y no hay una API oficial de P2P,
 * asi que estos selectores van a romperse en algun momento. Cuando eso pase:
 * 1. Abri la pagina de ordenes P2P con el navegador visible (HEADLESS=false).
 * 2. Click derecho -> Inspeccionar sobre el elemento que dejo de funcionar.
 * 3. Actualiza el selector aqui abajo. No hace falta tocar el resto del bot.
 */
export const selectors = {
  orderRow: "[data-testid='order-list-row'], .css-order-row",
  orderId: "[data-testid='order-id']",
  counterpartyName: "[data-testid='counterparty-name']",
  orderStatus: "[data-testid='order-status']",
  openChatButton: "[data-testid='open-chat-button']",
  chatMessageItem: "[data-testid='chat-message-item']",
  chatMessageText: "[data-testid='chat-message-text']",
  chatInput: "[data-testid='chat-input']",
  chatSendButton: "[data-testid='chat-send-button']",
  // Texto (en minusculas) que Binance muestra cuando el comprador ya marco el pago.
  paidStatusKeywords: ["paid", "pagado", "marked as paid"],
};
