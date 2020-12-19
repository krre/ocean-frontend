import { render } from "../../src/node_modules/bbcode/renderer"

describe("BBCode renderer", () => {
    test("bold", () => {
        expect(render({ name: "b", attrs: {}, nodes: ["bold text"] })).toBe("<strong>bold text</strong>");
    });

    test("italic", () => {
        expect(render({ name: "i", attrs: {}, nodes: ["italic text"] })).toBe("<em>italic text</em>");
    });

    test("underline", () => {
        expect(render({ name: "u", attrs: {}, nodes: ["underline text"] })).toBe("<ins>underline text</ins>");
    });

    test("strikethrough", () => {
        expect(render({ name: "s", attrs: {}, nodes: ["strikethrough text"] })).toBe("<del>strikethrough text</del>");
    });

    test("url", () => {
        expect(render({ name: "url", attrs: {}, nodes: ["https://ocean-mandela.info"] })).toBe(`<a href="https://ocean-mandela.info">https://ocean-mandela.info</a>`);
    });

    test("url description", () => {
        expect(render({ name: "url", attrs: { url: "https://ocean-mandela.info" }, nodes: ["Ocean"] })).toBe(`<a href="https://ocean-mandela.info">Ocean</a>`);
    });
})
