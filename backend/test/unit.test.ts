import { expect, test } from "vitest";
import {
  letterToKb,
  wordDifference,
  cosineSimilarity,
  sortLetters,
  keepLetters,
  lerp,
  wordVecInterp,
  sum,
  zip,
  l2Norm,
  dot,
} from "../src/misc/wordToVec.js";
import wordToVec from "../src/misc/wordToVec.js";

test("Letter to Kb", async () => {
  expect(letterToKb("Q")).toStrictEqual(-1);
  expect(letterToKb("L")).toStrictEqual(1);
  expect(letterToKb("G")).toStrictEqual(-letterToKb("Y"));
  expect(letterToKb("R") + letterToKb("J")).toStrictEqual(0);
  expect(letterToKb("Q") + letterToKb("W")).toStrictEqual(-1.92);
  expect(letterToKb("a")).toBeUndefined();
  expect(letterToKb("1")).toBeUndefined();
  expect(letterToKb(",")).toBeUndefined();
  expect(letterToKb(" ")).toBeUndefined();
});

test("Linear interpolation", async () => {
  expect(lerp(1, 2, 0)).toStrictEqual(1);
  expect(lerp(1, 2, 1)).toStrictEqual(2);
  expect(lerp(1, 2, 0.5)).toStrictEqual(1.5);
  expect(lerp(2, 1, 0.5)).toStrictEqual(1.5);
  expect(lerp(0, 10, 2)).toStrictEqual(20);
  expect(lerp(0, 10, -1)).toStrictEqual(-10);
});

test("Sum", async () => {
  expect(sum([1])).toStrictEqual(1);
  expect(sum([1, 2, 3, 4, 5])).toStrictEqual(15);
  expect(sum([2, -4, 6, -8, 10])).toStrictEqual(6);
  expect(sum([-0.5, 0.3, -0.3])).toStrictEqual(-0.5);
  expect(sum([1, NaN, 2])).toBeNaN();
  expect(sum([1, Infinity, 2])).toStrictEqual(Infinity);
});

test("Zip", async () => {
  expect(zip([], [])).toStrictEqual([]);
  expect(zip(["A"], [])).toStrictEqual([["A", undefined]]);
  expect(zip([], [-5])).toStrictEqual([]);
  expect(zip(["a", "b", "c"], [1, 2, 3])).toStrictEqual([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]);
  expect(zip(["a", "b"], [1, 2, 3])).toStrictEqual([
    ["a", 1],
    ["b", 2],
  ]);
  expect(zip(["a", "b", "c"], [1, 2])).toStrictEqual([
    ["a", 1],
    ["b", 2],
    ["c", undefined],
  ]);
});

test("L2Norm", async () => {
  expect(l2Norm([8])).toStrictEqual(64);
  expect(l2Norm([2, 3])).toStrictEqual(13);
  expect(l2Norm([2, 3, 5])).toStrictEqual(38);
  expect(l2Norm([-7, -2])).toStrictEqual(53);
  expect(l2Norm([-0.5, 1.5])).toStrictEqual(2.5);
  expect(l2Norm([4, NaN, 6])).toBeNaN();
  expect(l2Norm([4, Infinity, 6])).toStrictEqual(Infinity);
});

test("Dot", async () => {
  expect(dot([6], [5])).toStrictEqual(30);
  expect(dot([1, 2, 3], [1, 2, 3])).toStrictEqual(14);
  expect(dot([1, 2, 3], [4, 5])).toBeNaN();
  expect(dot([0.2, 0.3], [0.7, 1.2])).toStrictEqual(0.5);
  expect(dot([2, -5], [3, 8])).toStrictEqual(-34);
  expect(dot([4, NaN, 6], [5, NaN, 2])).toBeNaN();
  expect(dot([1, Infinity, 8], [9, Infinity, 3])).toStrictEqual(Infinity);
});

test("Word Difference", async () => {
  expect(wordDifference("a", "b")).toStrictEqual(-5.952380952380951);
  expect(wordDifference("Adam", "Padam")).toBeGreaterThan(1);
  expect(wordDifference("John", "John")).toBeGreaterThan(2.9);
  expect(
    wordDifference("Really long text idk", "Dinosaurs with mexican hats"),
  ).toBeNaN();
});

test("Keep Letters", async () => {
  expect(keepLetters("Text with spaces")).toStrictEqual("ext with spaces");
  expect(keepLetters("S")).toStrictEqual("");
  expect(keepLetters("text")).toStrictEqual("text");
  expect(keepLetters("%$%$$%")).toStrictEqual("$%$$%");
});

test("Sort Letters", async () => {
  expect(sortLetters("Constantinople")).toStrictEqual("Caeilnnnoopstt");
  expect(sortLetters(" ")).toStrictEqual(" ");
  expect(sortLetters("1611")).toStrictEqual("1116");
  expect(sortLetters("$#%")).toStrictEqual("#$%");
});

test("Cosine similarity equal to word Difference", async () => {
  expect(cosineSimilarity(wordToVec("a"), wordToVec("b"))).toStrictEqual(
    wordDifference("a", "b") / 64,
  );
  expect(
    cosineSimilarity(
      wordToVec("Really long text"),
      wordToVec("also really long text"),
    ),
  ).toStrictEqual(
    wordDifference("Really long text", "also really long text") / 64,
  );
});

test("Word to Vec", async () => {
  expect(wordToVec("")).toStrictEqual([]);
  expect(wordToVec("1")).toStrictEqual([]);
  expect(wordToVec(" ")).toStrictEqual([]);
  expect(wordToVec("$")).toStrictEqual([]);
  expect(wordToVec("A")[0]).toStrictEqual(-0.84);
});
