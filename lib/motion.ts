/** The single easing curve of the épure system (proto: `--ease`). */
export const EASE = [0.65, 0, 0.15, 0.99] as const;

/** Reveal-once viewport config, shared by every scroll-triggered animation. */
export const VIEWPORT_ONCE = { once: true, amount: 0.15 } as const;
