"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
let conf = vscode.workspace.getConfiguration('markdownExtended');
class ConfigReader {
    _read(key) {
        return conf.get(key);
    }
    watch() {
        return vscode.workspace.onDidChangeConfiguration(() => {
            conf = vscode.workspace.getConfiguration('markdownExtended');
            this._phantomPath = "";
        });
    }
    get phantomPath() {
        return this._phantomPath || (() => {
            let phantomPath = this._read('phantomPath');
            if (!phantomPath)
                return "";
            if (!fs.existsSync(phantomPath)) {
                vscode.window.showWarningMessage("Invalid phantom binary path.");
                return "";
            }
            this._phantomPath = phantomPath;
            return phantomPath;
        })();
    }
}
exports.config = new ConfigReader();
//# sourceMappingURL=config.js.map