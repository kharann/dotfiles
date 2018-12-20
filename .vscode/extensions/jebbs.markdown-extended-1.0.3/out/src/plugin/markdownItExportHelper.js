"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
function MarkdownItExportHelper(md) {
    md.core.ruler.push("exportHelper", exportHelperWorker);
}
exports.MarkdownItExportHelper = MarkdownItExportHelper;
function exportHelperWorker(state) {
    let env = state.env.htmlExporter;
    if (!env)
        return;
    enumTokens(state.tokens, env);
}
function enumTokens(tokens, env) {
    tokens.map(t => {
        if (t.type == "image") {
            removeVsUri(t, env.vsUri);
            if (env.embedImage)
                embedImage(t, env.workspaceFolder);
        }
        if (t.children)
            enumTokens(t.children, env);
    });
}
function removeVsUri(token, vsUri) {
    let index = 0;
    let src = "";
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i][0] == "src") {
            index = i;
            src = token.attrs[i][1];
        }
    }
    token.attrs[index][1] = src.replace(vsUri, "");
}
function embedImage(token, basePath) {
    let index = 0;
    let src = "";
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i][0] == "src") {
            index = i;
            src = token.attrs[i][1];
        }
    }
    token.attrs[index][1] = image2Base64(src, basePath);
}
function image2Base64(src, basePath) {
    let file = path.join(basePath, src);
    if (!fs.existsSync(file))
        return src;
    let ext = path.extname(src).toLowerCase();
    let scheme = "";
    switch (ext) {
        case ".gif":
            scheme = "image/gif";
            break;
        case ".png":
            scheme = "image/png";
            break;
        case ".jpg":
        case ".jpeg":
            scheme = "image/jpeg";
            break;
        case ".icon":
        case ".ico":
            scheme = "image/x-icon";
            break;
        default:
            scheme = "";
            break;
    }
    if (!scheme)
        return src;
    let b64 = fs.readFileSync(file).toString('base64');
    return `data:${scheme};base64,${b64}`;
}
//# sourceMappingURL=markdownItExportHelper.js.map