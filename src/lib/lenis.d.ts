declare module "lenis" {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    touchMultiplier?: number;
    [key: string]: unknown;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    on(event: string, callback: (...args: unknown[]) => void): void;
    raf(time: number): void;
    stop(): void;
    destroy(): void;
  }
}
