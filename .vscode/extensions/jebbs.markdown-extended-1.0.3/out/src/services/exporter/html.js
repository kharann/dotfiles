"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const tools_1 = require("../common/tools");
const path = require("path");
const shared_1 = require("./shared");
const interfaces_1 = require("./interfaces");
class HtmlExporter {
    Export(items, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = items.length;
            return items.reduce((p, c, i) => {
                return p
                    .then(() => {
                    if (progress)
                        progress.report({
                            message: `${path.basename(c.fileName)} (${i + 1}/${count})`,
                            increment: ~~(1 / count
                                * 100)
                        });
                })
                    .then(() => this.exportFile(c));
            }, Promise.resolve(null));
        });
    }
    exportFile(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let document = yield vscode.workspace.openTextDocument(item.uri);
            let html = shared_1.renderPage(document);
            tools_1.mkdirsSync(path.dirname(item.fileName));
            return new Promise((resolve, reject) => {
                try {
                    fs.writeFileSync(item.fileName, html, "utf-8");
                    resolve("ok");
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    FormatAvailable(format) {
        return interfaces_1.exportFormat.HTML == format;
    }
}
exports.htmlExporter = new HtmlExporter();
//# sourceMappingURL=html.js.map