export { }
import { name, char, wsp, text, quoted, attr, attrs, open, close, node } from "../../src/node_modules/bbcode/parser"

describe("BBCode parser", () => {
    test("name", () => {
        expect(name.exec("Width", 0)).toStrictEqual({ res: "width", end: 5 })
    });

    test("char", () => {
        expect(char.exec("x", 0)).toStrictEqual({ res: "x", end: 1 })
    });

    test("wsp", () => {
        expect(wsp.exec("  ", 0)).toStrictEqual({ res: "  ", end: 2 })
    });

    test("text", () => {
        expect(text.exec("w3$u", 0)).toStrictEqual({ res: "w3$u", end: 4 })
    });

    test("quoted", () => {
        expect(quoted.exec('"400"', 0)).toStrictEqual({ res: "400", end: 5 })
    });

    test("attr", () => {
        expect(attr.exec('width="500"', 0)).toStrictEqual({ res: { name: "width", value: "500" }, end: 11 })
    });

    test("attrs", () => {
        expect(attrs.exec('width="500" height="200"', 0)).toStrictEqual({ res: { width: "500", height: "200" }, end: 24 })
    });

    test("open", () => {
        expect(open.exec('[b]', 0)).toStrictEqual({ res: { name: "b", attrs: {} }, end: 3 })
    });

    test("open attrs", () => {
        expect(open.exec('[b width="500" height="200"]', 0)).toStrictEqual({ res: { name: "b", attrs: { width: "500", height: "200" } }, end: 28 })
    });

    test("close", () => {
        expect(close.exec('[/b]', 0)).toStrictEqual({ res: "b", end: 4 })
    });

    // test("node", () => {
    //     expect(node.exec('[b]bold text[/b]', 0)).toStrictEqual({ res: { name: "b", attrs: {} }, end: 11 })
    // });

    // test("bold", () => {
    //     expect(parse("[b]bold text[/b]")).toBe("<strong>bold text</strong>");
    // })

    // test("raw link", () => {
    //     expect(parse("[url]http://ocean-mandela.info[/url]")).toBe(`<a href="http://ocean-mandela.info">http://ocean-mandela.info</a>`);
    // });
})
