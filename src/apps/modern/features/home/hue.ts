/**
 * Deterministic per-title color, per the redesign handoff.
 * A title maps to a stable hue, from which we derive the card/hero gradient
 * and glow. Used as the artwork placeholder (and ambient glow) when no real
 * poster/backdrop image is available.
 */
export function hueFromString(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) % 360;
    }
    return h;
}

/** Card poster gradient: c1 = oklch(0.45 0.15 hue), c2 = oklch(0.19 0.08 hue+50). */
export function cardGradient(hue: number): string {
    const c1 = `oklch(0.45 0.15 ${hue})`;
    const c2 = `oklch(0.19 0.08 ${(hue + 50) % 360})`;
    return `linear-gradient(150deg, ${c1} 0%, ${c2} 100%)`;
}

/** Per-title glow color (used for hover shadow / hero radial). */
export function cardGlow(hue: number): string {
    return `oklch(0.6 0.18 ${hue} / 0.4)`;
}

/** Hero backdrop gradient, fading to the page background at the bottom. */
export function heroGradient(hue: number): string {
    const c1 = `oklch(0.45 0.15 ${hue})`;
    const c2 = `oklch(0.19 0.08 ${(hue + 50) % 360})`;
    return `linear-gradient(160deg, ${c1} 0%, ${c2} 55%, var(--jf-redesign-bg, #0e0e14) 100%)`;
}
