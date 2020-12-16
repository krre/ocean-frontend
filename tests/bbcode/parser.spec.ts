export { }
import { parse, attr } from "../../src/node_modules/bbcode/parser"

describe("BBCode parser", () => {
    test("attr", () => {
        expect(attr.exec('width="500"', 0)).toStrictEqual({ res: { name: "width", value: "500" }, end: 11 })
    });

    // test("bold", () => {
    //     expect(parse("[b]bold text[/b]")).toBe("<strong>bold text</strong>");
    // })

    // test("raw link", () => {
    //     expect(parse("[url]http://ocean-mandela.info[/url]")).toBe(`<a href="http://ocean-mandela.info">http://ocean-mandela.info</a>`);
    // });
})
