import weddingData from "@config/wedding.json";
import tasyakurData from "@config/tasyakur.json";
import type { WeddingConfig } from "./types";

const eventType = process.env.NEXT_PUBLIC_EVENT_TYPE || "wedding";
export const isTasyakur = eventType === "tasyakur";
export const config = (isTasyakur ? tasyakurData : weddingData) as unknown as WeddingConfig;

export default config;
