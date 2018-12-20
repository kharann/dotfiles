"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container = require("markdown-it-container");
function MarkdownItContainer(md) {
    md.use(container, "container", { validate: validate, render: render });
}
exports.MarkdownItContainer = MarkdownItContainer;
function validate() {
    return true;
}
function render(tokens, idx) {
    if (tokens[idx].nesting === 1) {
        // opening tag 
        let cls = escape(tokens[idx].info.trim());
        return `<div class="${cls}">\n`;
    }
    else {
        // closing tag 
        return '</div>\n';
    }
}
function escape(str) {
    return str.replace(/"/g, '&quot;')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
//# sourceMappingURL=markdownItContainer.js.map