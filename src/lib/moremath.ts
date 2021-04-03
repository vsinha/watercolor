export function randRange(from: number, to: number): number {
  return Math.random() * (to - from) + from;
}

export const randElem = <T>(arr: T[]): T =>
  arr[Math.floor(randRange(0, arr.length))];

export function round_to_nearest_multiple(
  input: number,
  round_to: number
): number {
  return round(input / round_to) * round_to;
}
