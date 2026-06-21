import { promises as fs } from "fs";
import path from "path";
import type { Wish } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "wishes.json");

/**
 * File-backed guestbook store with an in-memory fallback. On read-only
 * deployments (e.g. some serverless platforms) writes silently fall back to
 * memory so the UX still works for the current session.
 */
let memory: Wish[] | null = null;

async function readFile(): Promise<Wish[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as Wish[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getWishes(): Promise<Wish[]> {
  if (memory) return memory;
  memory = await readFile();
  return memory;
}

export async function addWish(input: {
  name: string;
  message: string;
  attendance: Wish["attendance"];
}): Promise<Wish> {
  const wishes = await getWishes();

  const wish: Wish = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.slice(0, 60).trim(),
    message: input.message.slice(0, 500).trim(),
    attendance: input.attendance,
    createdAt: new Date().toISOString(),
  };

  const next = [wish, ...wishes];
  memory = next;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf-8");
  } catch {
    /* read-only fs — keep in memory only */
  }

  return wish;
}
