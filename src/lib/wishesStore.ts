import {
  listPublicWishes,
  appendPublicWish,
  updatePublicWishReplies,
} from "./google-sheets";
import type { Wish, WishReply } from "./types";

export async function getWishes(): Promise<Wish[]> {
  return listPublicWishes();
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

  await appendPublicWish(wish);

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

  await updatePublicWishReplies(input.wishId, newReplies);

  return reply;
}
