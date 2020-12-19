// BBCode parser based on article https://habr.com/ru/post/224081
import { doc } from "./parser";
import { render } from "./renderer";

export function parse(text: string): string {
    const ast = doc.exec(text, 0);
    const res = render(ast.res);
    return res;
}
