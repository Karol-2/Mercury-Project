import unidecode from "unidecode";

const kb = [
  2, 15, 9, 7, 5, 10, 13, 16, 18, 19, 22, 25, 21, 20, 23, 24, 0, 6, 4, 11, 17,
  14, 1, 8, 12, 3,
];
const kbValue = [...kb].map((c) => (c / 25) * 2 - 1);

const letterToKb = (c: string) => kbValue[c.charCodeAt(0) - 65];

const lerp = (a: number, b: number, f: number) => (1 - f) * a + f * b;

const wordVecInterp = (word: string, vecLength: number) => {
  const vec = [];
  const wordCapital = word.toUpperCase();
  const factor = (word.length - 1) / (vecLength - 1);

  for (let rIndex = 0; rIndex < vecLength; rIndex++) {
    const wIndex = rIndex * factor;
    const wIndexFloor = Math.floor(wIndex);
    const wIndexMod = wIndex % 1;

    const first = letterToKb(wordCapital.charAt(wIndexFloor));

    if (wIndexFloor < word.length - 1) {
      const second = letterToKb(wordCapital.charAt(wIndexFloor + 1));
      const value = lerp(first, second, wIndexMod);
      vec.push(value);
    } else {
      vec.push(first);
    }
  }

  return vec;
};

const keepLettersRegex = /[^a-z]/;
const keepLetters = (s: string) => s.replace(keepLettersRegex, "");
const sortLetters = (s: string) => [...s].sort().join("");

function sum(lst: number[]): number {
  return lst.reduce((a, b) => a + b);
}

function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return a.map((e, i) => [e, b[i]]);
}

function l1Norm(a: number[]): number {
  return sum(a.map((x) => Math.abs(x)));
}

function l2Norm(a: number[]): number {
  return sum(a.map((x) => Math.pow(x, 2)));
}

function dot(a: number[], b: number[]): number {
  return sum(zip(a, b).map(([a, b]) => a * b));
}

function cosineSimilarity(a: number[], b: number[]): number {
  return dot(a, b) / (l2Norm(a) * l2Norm(b));
}

function wordToVec(word: string) {
  const wordNormalized = unidecode(word);
  const wordFilter = keepLetters(wordNormalized.toLowerCase());

  if (wordFilter.length == 0) {
    return [];
  }

  const vecOrder = wordVecInterp(wordFilter, 32);
  const vecSort = wordVecInterp(sortLetters(wordFilter), 32);

  return [...vecOrder, ...vecSort].map((x) => x);
}

export const wordDifference = (a: string, b: string) => {
  const vecA = wordToVec(a);
  const vecB = wordToVec(b);
  return cosineSimilarity(vecA, vecB) * 64;
};

export default wordToVec;
