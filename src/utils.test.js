import * as utils from "./utils.js";

describe("getRandomInt", () => {
  test("returns a random integer between bounds", () => {
    const min = 0;
    const max = 100;
    const result = utils.getRandomInt(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
    // Check is an integer
    expect(result - Math.floor(result)).toBe(0);
  });
  test("lower bound is inclusive, upper bound is exclusive", () => {
    const min = 0;
    const max = 1;
    const result = utils.getRandomInt(min, max);
    expect(result).toBe(0);
    const result2 = utils.getRandomInt(min, max);
    expect(result2).toBe(0);
  });
});

describe("getRandomVector", () => {
  test("Returned values add up to total", () => {
    const total = 10;
    const {dx, dy} = utils.getRandomVector(total);
    expect(Math.abs(dx) + Math.abs(dy)).toBe(10);
  });
});
