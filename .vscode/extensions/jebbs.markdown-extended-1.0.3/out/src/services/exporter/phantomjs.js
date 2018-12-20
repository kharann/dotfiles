"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../common/tools");
const path = require("path");
const pdf = require("html-pdf");
const shared_1 = require("./shared");
function phantomExport(document, fileName, callback) {
    let inject = "";
    switch (document.meta.phantomConfig.type) {
        case "pdf":
            inject = `/* injected by phantomExport */
                    body, .vscode-body {
                        max-width: 100% !important;
                        width: 1000px !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }`;
            break;
        case "png":
        case "jpeg":
            inject = `/* injected by phantomExport */
                    body, .vscode-body {
                        width: 1000px !important;
                    }`;
        default:
            break;
    }
    tools_1.mkdirsSync(path.dirname(fileName));
    let html = shared_1.renderHTML(document, true, inject);
    pdf.create(html, document.meta.phantomConfig).toFile(fileName, callback);
}
exports.phantomExport = phantomExport;
//# sourceMappingURL=phantomjs.js.map