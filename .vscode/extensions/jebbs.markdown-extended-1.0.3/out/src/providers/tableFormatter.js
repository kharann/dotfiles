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
const convertTable_1 = require("../services/table/convertTable");
class TableFormatter extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this._inEditing = false;
        this._disposable = vscode.workspace.onDidChangeTextDocument(e => this.onChange(e));
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    onChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._inEditing)
                return;
            this._inEditing = true;
            let edits = e.contentChanges.map(c => {
                return {
                    range: this.calcRange(c),
                    newText: convertTable_1.convertToMarkdownTable(c.text),
                };
            }).filter(e => e.newText);
            if (edits.length)
                yield this.applyEdits(e.document, edits);
            this._inEditing = false;
        });
    }
    applyEdits(document, edits) {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = yield vscode.window.showTextDocument(document);
            let editJobs = edits.map((e, i) => editor.edit(edit => {
                edit.replace(e.range, e.newText);
            }));
            yield Promise.all(editJobs);
        });
    }
    /**
     * Calculate a new Range that represents to the new texts after editing.
     * @param change Event Arg provided by onDidChangeTextDocument
     */
    calcRange(change) {
        let start = change.range.start;
        let lines = change.text.split('\n');
        let lineCount = lines.length;
        let end;
        if (lineCount > 1) {
            end = new vscode.Position(change.range.start.line + lineCount - 1, lines[lineCount - 1].replace('\r', "").length);
        }
        else {
            end = change.range.start.translate(0, change.text.length);
        }
        return new vscode.Range(start, end);
    }
}
exports.TableFormatter = TableFormatter;
//# sourceMappingURL=tableFormatter.js.map