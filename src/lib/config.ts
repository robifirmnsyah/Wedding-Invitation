import weddingData from "@config/wedding.json";
import type { WeddingConfig } from "./types";

export const config = weddingData as unknown as WeddingConfig;

export default config;
