"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
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
exports.applyOffset = applyOffset;
//# sourceMappingURL=selectionOffset.js.map