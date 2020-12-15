export { }
import { parse } from "../../src/node_modules/bbcode"

describe("BBCode parser", () => {
    test("BBCode bold", () => {
        expect(parse("[b]bold text[/b]")).toBe("<strong>bold text</strong>");
    })

    test("BBCode raw link", () => {
        expect(parse("[url]http://ocean-mandela.info[/url]")).toBe(`<a href="http://ocean-mandela.info">http://ocean-mandela.info</a>`);
    });
})
