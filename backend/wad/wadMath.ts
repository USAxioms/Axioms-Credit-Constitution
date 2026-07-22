// WAD MATH LIBRARY
// Deterministic fixed‑point arithmetic for AXIOMS scoring.
// All values are scaled by 1e18 (WAD).

export const WAD_ONE = 1_000_000_000_000_000_000n; // 1.0 in WAD
export const WAD_ZERO = 0n;

// Multiply two WAD numbers: (a * b) / 1e18
export function wadMul(a: bigint, b: bigint): bigint {
  return (a * b) / WAD_ONE;
}

// Divide two WAD numbers: (a * 1e18) / b
export function wadDiv(a: bigint, b: bigint): bigint {
  if (b === 0n) throw new Error("WAD division by zero");
  return (a * WAD_ONE) / b;
}

// Convert integer percent (e.g., 75) to WAD (0.75 * 1e18)
export function pctToWad(pct: number): bigint {
  return BigInt(Math.round((pct / 100) * Number(WAD_ONE)));
}

// Convert WAD to percent string
export function wadToPctString(wad: bigint): string {
  const pct = Number(wad) / Number(WAD_ONE) * 100;
  return pct.toFixed(2);
}

// Clamp WAD value between min and max
export function wadClamp(x: bigint, min: bigint, max: bigint): bigint {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

// Linear interpolation between two WAD values
export function wadLerp(a: bigint, b: bigint, t: bigint): bigint {
  // t is WAD (0 to 1)
  return a + wadMul(b - a, t);
}

// WAD exponent (integer exponent only)
export function wadPow(base: bigint, exp: number): bigint {
  let result = WAD_ONE;
  for (let i = 0; i < exp; i++) {
    result = wadMul(result, base);
  }
  return result;
}
