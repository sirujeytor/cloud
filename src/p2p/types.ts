export interface OpenOrder {
  orderId: string;
  counterparty: string;
  side: "buy" | "sell" | "unknown";
  statusText: string;
  detailUrl: string;
}

export interface ChatMessage {
  id: string;
  fromCounterparty: boolean;
  text: string;
}

export interface BotState {
  // mensajes que ya vimos y no necesitan otra respuesta
  seenMessageIds: string[];
  // ordenes para las que ya mandamos el aviso de "pago marcado"
  notifiedPaidOrderIds: string[];
}

export const emptyState: BotState = {
  seenMessageIds: [],
  notifiedPaidOrderIds: [],
};
