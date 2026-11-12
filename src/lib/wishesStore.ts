import { listPublicWishes, appendPublicWish, updatePublicWishReplies } from "./google-sheets";
import type { Wish, WishReply } from "./types";

let memory: Wish[] | null = null;

export async function getWishes(): Promise<Wish[]> {
  try {
    const wishes = await listPublicWishes();
    memory = wishes;
    return wishes;
  } catch (error) {
    console.error("Failed to fetch wishes from Google Sheets:", error);
    return memory || [];
  }
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function addWish(input: {
  name: string;
  message: string;
  attendance: Wish["attendance"];
  verified?: boolean;
}): Promise<Wish> {
  const wish: Wish = {
    id: uid(),
    name: input.name.slice(0, 60).trim(),
    message: input.message.slice(0, 500).trim(),
    attendance: input.attendance,
    createdAt: new Date().toISOString(),
    verified: input.verified ?? false,
    replies: [],
  };

  try {
    await appendPublicWish(wish);
    if (memory) memory = [wish, ...memory];
  } catch (error) {
    console.error("Failed to append wish to Google Sheets:", error);
    if (memory) memory = [wish, ...memory];
  }
  
  return wish;
}

export async function addReply(input: {
  wishId: string;
  name: string;
  message: string;
}): Promise<WishReply | null> {
  const wishes = await getWishes();
  const target = wishes.find((w) => w.id === input.wishId);
  if (!target) return null;

  const reply: WishReply = {
    id: uid(),
    name: input.name.slice(0, 60).trim(),
    message: input.message.slice(0, 300).trim(),
    createdAt: new Date().toISOString(),
  };

  const newReplies = [...(target.replies || []), reply];

  try {
    await updatePublicWishReplies(input.wishId, newReplies);
    target.replies = newReplies;
  } catch (error) {
    console.error("Failed to update replies in Google Sheets:", error);
    target.replies = newReplies;
  }
  
  return reply;
}
