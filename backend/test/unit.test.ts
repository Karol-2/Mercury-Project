import { expect, test } from "vitest";
import letterToKb, { wordDifference } from "../src/misc/wordToVec.js";

test("Letter to Kb", async () => {
  expect(letterToKb("X")).toStrictEqual([
    -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36,
    -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36,
    -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36,
    -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36,
    -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36,
    -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36, -0.36,
  ]);

  expect(letterToKb("a")).toStrictEqual([
    -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84,
    -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84,
    -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84,
    -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84,
    -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84,
    -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84, -0.84,
  ]);

  expect(letterToKb("1")).toStrictEqual([]);
  expect(letterToKb(" ")).toStrictEqual([]);
});

test("Word Difference", async () => {
  expect(wordDifference("a", "b")).toStrictEqual(-5.952380952380951);
  expect(wordDifference("Adam", "Padam")).toBeGreaterThan(1);
  expect(wordDifference("John", "John")).toBeGreaterThan(2.9);
  expect(
    wordDifference("Really long text idk", "Dinosaurs with mexican hats"),
  ).toBeNaN();
});
