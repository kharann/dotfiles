"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MarkdownItAnchorLink(md) {
    md.core.ruler.push("embedImage", embedImageWorker);
}
exports.MarkdownItAnchorLink = MarkdownItAnchorLink;
function embedImageWorker(state) {
    if (!state.html.embedImage)
        return;
    state.tokens.map(t => {
        if (t.type == "inline" &&
            t.children &&
            t.children.length &&
            anchorLinkReg.test(t.content)) {
            let matches;
            let links = [];
            anchorLinkReg.lastIndex = 0;
            while (matches = anchorLinkReg.exec(t.content)) {
                links.push("#" + slugify(matches[1]));
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
//# sourceMappingURL=markdownItEmbedImage.js.map