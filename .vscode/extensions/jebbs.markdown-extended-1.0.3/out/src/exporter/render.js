"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("../extension");
class Render {
    get markdown() {
        if (!extension_1.markdown)
            vscode.commands.executeCommand("markdown.showPreviewToSide");
        return extension_1.markdown;
    }
}
exports.render = new Render();
//# sourceMappingURL=render.js.map