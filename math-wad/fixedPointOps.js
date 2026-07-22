// Deterministic Wad Arithmetic Operators
import { WAD } from "./wad.js";

export function wadMul(a, b) {
  return (a * b) / WAD;
}

export function wadDiv(a, b) {
  return (a * WAD) / b;
}
