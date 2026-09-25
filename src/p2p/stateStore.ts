import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { config } from "../config.js";
import { type BotState, emptyState } from "./types.js";

export async function loadState(): Promise<BotState> {
  try {
    const raw = await readFile(config.stateFilePath, "utf8");
    return { ...emptyState, ...(JSON.parse(raw) as Partial<BotState>) };
  } catch {
    return { ...emptyState };
  }
}

export async function saveState(state: BotState): Promise<void> {
  await mkdir(dirname(config.stateFilePath), { recursive: true });
  await writeFile(config.stateFilePath, JSON.stringify(state, null, 2), "utf8");
}
