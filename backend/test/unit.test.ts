import { expect, test } from "vitest";
import {
  letterToKb,
  wordDifference,
  cosineSimilarity,
  sortLetters,
  keepLetters,
  lerp,
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
