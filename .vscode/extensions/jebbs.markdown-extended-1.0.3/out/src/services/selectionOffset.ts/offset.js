"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function applyOffset(editor, offsets) {
    let selections = offsets.map(s => new vscode.Selection(s.orignal.anchor.translate(s.offset.line, s.offset.charachter), s.orignal.active.translate(s.offset.line, s.offset.charachter)));
    editor.selections = selections;
}
exports.applyOffset = applyOffset;
//# sourceMappingURL=offset.js.map