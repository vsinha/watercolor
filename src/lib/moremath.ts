export const randRange = (from: number, to: number): number =>
  Math.random() * (to - from) + from;

export const randGaussian = (): number => {
  let rand = 0;
  for (let i = 0; i < 3; i += 1) {
    rand += Math.random();
  }
  return rand / 3;
};

export const randGaussianRange = (from: number, to: number): number =>
  randGaussian() * (to - from) + from;

export const randElem = <T>(arr: T[]): T =>
  arr[Math.floor(randRange(0, arr.length))];

export const roundToMultiple = (input: number, round_to: number): number =>
  round(input / round_to) * round_to;
