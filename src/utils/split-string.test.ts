import { describe, expect, it } from "vitest";
import { splitString } from "./split-string";

describe("splitString", () => {
  it('splits abba, searching for a, into: ["a", "bb", "a"]', () => {
    expect(splitString("a", "abba")).toEqual([
      { content: "a", match: true },
      { content: "bb", match: false },
      { content: "a", match: true },
    ]);
  });

  it('splits unifi, searching for uni, into ["uni", "fi"]', () => {
    expect(splitString("uni", "unifi")).toEqual([
      { content: "uni", match: true },
      { content: "fi", match: false },
    ]);
  });

  it("does not add empty string when match is in beginning of word", () => {
    expect(splitString("a", "aaa")).toEqual([
      { content: "a", match: true },
      { content: "a", match: true },
      { content: "a", match: true },
    ]);
  });

  it("ignores casing and picks the original casing as result", () => {
    expect(splitString("tHE", "THESTRING")).toEqual([
      { content: "THE", match: true },
      { content: "STRING", match: false },
    ]);
  });

  it("keeps whitespaces", () => {
    expect(splitString("a long", "a long but strange sentence  . ")).toEqual([
      { content: "a long", match: true },
      { content: " but strange sentence  . ", match: false },
    ]);
  });
});
