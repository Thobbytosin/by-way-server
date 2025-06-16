import { add } from "../../utils/helpers";

describe("Math Utils", () => {
  test("should add two numbers", () => {
    const result = add(4, 8);
    expect(result).toBe(12);
  });
});
