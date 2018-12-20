"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toc = require("markdown-it-table-of-contents");
const shared_1 = require("./shared");
const config_1 = require("../services/common/config");
function MarkdownItTOC(md) {
    md.renderer.rules.tocAnchor = renderHtml;
    md.core.ruler.push("tocAnchor", tocAnchorWorker);
    md.use(toc, { slugify: shared_1.slugify, includeLevel: config_1.config.tocLevels });
}
exports.MarkdownItTOC = MarkdownItTOC;
function renderHtml(tokens, idx) {
    // console.log("request anchor for:", idx, tokens[idx].content);
    let token = tokens[idx];
    if (token.type !== "tocAnchor")
        return tokens[idx].content;
    return `<a for="toc-anchor" id="${shared_1.slugify(token.content)}"></a>`;
}
function tocAnchorWorker(state) {
    let tokens = [];
    state.tokens.map((t, i, ts) => {
        if (t.type == "heading_open") {
            let anchor = new state.Token("tocAnchor", "a", 0);
            anchor.content = ts[i + 1].content;
            tokens.push(anchor);
        }
        tokens.push(t);
    });
    state.tokens = tokens;
}
//# sourceMappingURL=markdownItTOC.js.map