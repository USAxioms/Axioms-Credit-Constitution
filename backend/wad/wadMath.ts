// WAD Math Core
// 1e18 fixed-point arithmetic for constitutional backend

export const WAD_ONE = 10n ** 18n;
export const WAD_ZERO = 0n;

// Multiply two WAD numbers: (a * b) / 1e18
export function wadMul(a: bigint, b: bigint): bigint {
  return (a * b) / WAD_ONE;
}

// Divide two WAD numbers: (a * 1e18) / b
export function wadDiv(a: bigint, b: bigint): bigint {
  if (b === 0n) throw new Error("div/0");
  return (a * WAD_ONE) / b;
}

// Saturating subtraction: never below zero
export function wadSubSat(a: bigint, b: bigint): bigint {
  return a > b ? a - b : WAD_ZERO;
}

export function wadMin(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

export function wadMax(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}

// Percentage helper: WAD → string like "72.50"
export function wadToPctString(v: bigint): string {
  const scaled = v / (10n ** 16n); // now in "percent * 100"
  const whole = scaled / 100n;
  const frac = scaled % 100n;
  const fracStr = frac.toString().padStart(2, "0");
  return `${whole.toString()}.${fracStr}`;
}
