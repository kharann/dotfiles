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
function editTextDocument(document, edits) {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = yield vscode.window.showTextDocument(document);
        editor.edit(e => {
            edits.map(edit => {
                if (!edit || !edit.range || !edit.replace)
                    return;
                e.replace(edit.range, edit.replace);
            });
        }).then(() => {
            let offsets = edits.map(e => e.selectionOffset).filter(s => !!s);
            applyOffset(editor, offsets);
        });
    });
}
exports.editTextDocument = editTextDocument;
function applyOffset(editor, offsets) {
    if (!editor || !offsets || !offsets.length)
        return;
    let selections = offsets.map(s => {
        if (!s || !s.orignal)
            return undefined;
        return new vscode.Selection(s.orignal.start.translate(s.offset.line, s.offset.charachter), s.orignal.end.translate(s.offset.line, s.offset.charachter));
    });
    editor.selections = selections;
}
//# sourceMappingURL=edit.js.map