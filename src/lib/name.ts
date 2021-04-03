import { randElem } from "./moremath.js";

const vowels = "aeiouy".split("");
const consonants = "bcdfghjklmnpqrstvwxz".split("");

const gen_letter = (letters: string[]): string => randElem(letters);
const gen_vowel = () => gen_letter(vowels);
const gen_consonant = () => gen_letter(consonants);

const choices = [
  () => gen_consonant() + gen_vowel(),
  () => gen_consonant() + gen_vowel() + gen_consonant(),
];

const gen_syllable = () => randElem(choices)();

export function generate(): string {
  let word = "";
  while (word.length < 4) {
    word = gen_syllable() + gen_syllable();
  }
  return word;
}
