import { readFile } from "node:fs/promises";
import { config } from "../config.js";

interface TemplateRule {
  keywords: string[];
  reply: string;
}

interface TemplatesFile {
  rules: TemplateRule[];
  fallback: string;
}

let cache: TemplatesFile | null = null;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // saca acentos para comparar
}

async function loadTemplates(): Promise<TemplatesFile> {
  if (cache) return cache;
  const raw = await readFile(config.templatesPath, "utf8");
  cache = JSON.parse(raw) as TemplatesFile;
  return cache;
}

/**
 * Devuelve una respuesta automatica para el mensaje del cliente, o null si
 * no hay ninguna regla que aplique (en ese caso no le mandes nada solo por
 * mandar algo raro: mejor avisarle a un humano).
 */
export async function findAutoReply(message: string): Promise<string | null> {
  const templates = await loadTemplates();
  const normalized = normalize(message);
  for (const rule of templates.rules) {
    const matches = rule.keywords.some((kw) => normalized.includes(normalize(kw)));
    if (matches) return rule.reply;
  }
  return null;
}

export async function getFallbackReply(): Promise<string> {
  const templates = await loadTemplates();
  return templates.fallback;
}
