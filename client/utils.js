export function isGameCode(str) {
  return str.length === 5 && /^\d{5}$/.test(str);
}