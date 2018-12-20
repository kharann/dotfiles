"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("node-yaml");
class MarkdownDocument {
    constructor(document) {
        this._document = document;
        this.loadMetaData();
    }
    get meta() {
        return this._meta;
    }
    get document() {
        return this._document;
    }
    get documentContent() {
        return this._content;
    }
    loadMetaData() {
        let meta = "";
        let startLine = -1;
        let endLine = -1;
        for (let i = 0; i < this._document.lineCount; i++) {
            let line = this._document.lineAt(i).text;
            if (i == 0 && line == "---")
                startLine = 0;
            if (i != 0 && line == "---") {
                endLine = i;
                break;
            }
        }
        if (startLine == 0 && endLine > 0)
            meta = this._document.getText(this._document.lineAt(1).range.union(this._document.lineAt(endLine - 1).range));
        else
            meta = "";
        this._meta = yaml.parse(meta);
        this._content = this._document.getText(this._document.lineAt(endLine + 1).range.union(this._document.lineAt(this._document.lineCount - 1).range));
    }
}
exports.MarkdownDocument = MarkdownDocument;
//# sourceMappingURL=metaReader.js.map