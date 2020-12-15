import { txt } from "../../src/node_modules/bbcode/pattern"

describe("BBCode pattern", () => {
    test("txt", () => {
        expect(txt("abc").exec("abc", 0)).toStrictEqual({ res: "abc", end: 3 });
    })

    test("txt", () => {
        expect(txt("abc").exec("ab", 0)).toBe(undefined);
    })
});
