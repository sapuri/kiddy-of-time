import { trimmedString, isWorkday, isHoliday } from "./main";

describe("trimmedString", () => {
  it("should remove line breaks from a string", () => {
    expect(trimmedString("Hello\nWorld")).toBe("HelloWorld");
  });

  it("should return an empty string if input is null or undefined", () => {
    expect(trimmedString(null)).toBe("");
    expect(trimmedString(undefined)).toBe("");
  });
});

describe("isWorkday", () => {
  it("should return true if the scheduleName contains 'Flex'", () => {
    expect(isWorkday("Flex")).toBe(true);
    expect(isWorkday("Hello Flex World")).toBe(true);
  });

  it("should return false if the scheduleName does not contain 'Flex'", () => {
    expect(isWorkday("Hello World")).toBe(false);
  });
});

describe("isHoliday", () => {
  it("should return true if the scheduleName does not contain 'Flex' and is not '--'", () => {
    expect(isHoliday("Holiday")).toBe(true);
    expect(isHoliday("Public Holiday")).toBe(true);
  });

  it("should return false if the scheduleName contains 'Flex' or is '--'", () => {
    expect(isHoliday("Flex")).toBe(false);
    expect(isHoliday("Hello Flex World")).toBe(false);
    expect(isHoliday("--")).toBe(false);
  });
});
