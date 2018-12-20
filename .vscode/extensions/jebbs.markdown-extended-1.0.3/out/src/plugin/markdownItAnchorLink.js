"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("./shared");
const anchorLinkReg = /\[.+?\]\(\s*#(\S+?)\s*\)/ig;
function MarkdownItAnchorLink(md) {
    md.core.ruler.push("anchorLink", anchorLinkWorker);
}
exports.MarkdownItAnchorLink = MarkdownItAnchorLink;
function anchorLinkWorker(state) {
    state.tokens.map(t => {
        if (t.type == "inline" &&
            t.children &&
            t.children.length &&
            anchorLinkReg.test(t.content)) {
            let matches;
            let links = [];
            anchorLinkReg.lastIndex = 0;
            while (matches = anchorLinkReg.exec(t.content)) {
                links.push("#" + shared_1.slugify(matches[1]));
            }
            let linkCount = t.children.reduce((p, c) => p += c.type == "link_open" ? 1 : 0, 0);
            if (linkCount !== links.length) {
                console.log("markdownExtended: Link count and link token count mismatch!");
            }
            else {
                t.children.map(t => {
                    if (t.type == "link_open")
                        t.attrs = [["href", links.shift()]];
                });
            }
        }
    });
}
//# sourceMappingURL=markdownItAnchorLink.js.map