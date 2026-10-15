import { describe, expect, it } from "vite-plus/test";
import { needleAngle, readingText } from "./Zeiger.ts";

describe("needleAngle", () => {
  it("turns from -60 at zero to 60 at the end of the scale", () => {
    expect(needleAngle(0, 1)).toBe(-60);
    expect(needleAngle(0.5, 1)).toBe(0);
    expect(needleAngle(1, 1)).toBe(60);
  });
  it("stays on the scale", () => {
    expect(needleAngle(5, 1)).toBe(60);
    expect(needleAngle(-1, 1)).toBe(-60);
  });
});

describe("readingText", () => {
  it("writes the value with its unit and the separator", () => {
    expect(readingText(false, 0.45, "A", 3, ",")).toBe("0,45 A");
    expect(readingText(false, 4.5, "V", 2, ".")).toBe("4.5 V");
  });
  it("writes a dash for a blank meter", () => {
    expect(readingText(true, 0.45, "A", 3, ",")).toBe("–");
  });
});
