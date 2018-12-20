"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
exports.pluginStyles = readStyles().join("\n");
function readStyles() {
    let styles = [];
    vscode.extensions.all.map((ext) => {
        if (!ext || !ext.packageJSON || !ext.packageJSON.contributes)
            return;
        let files = ext.packageJSON.contributes["markdown.previewStyles"];
        if (!files)
            return;
        files.map(f => {
            let fn = path.join(ext.extensionPath, f);
            if (!fs.existsSync(fn))
                return;
            styles.push(`/* ${path.basename(f)} */\n` + fs.readFileSync(fn));
        });
    }, "");
    return styles;
}
//# sourceMappingURL=styles.js.map