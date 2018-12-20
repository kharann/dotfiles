"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const editTextDocument_1 = require("../common/editTextDocument");
function toggleFormat(editor, detect, on, onReplace, off, offReplace, multiLine) {
    if (!editor || !editor.document)
        return;
    let isOn = false;
    let document = editor.document;
    let selection = editor.selection;
    let target = matchedInCursor(document, selection, detect);
    let newText = "";
    if (target)
        isOn = true;
    else if (multiLine)
        target = getLines(document, selection);
    else
        target = getWord(document, selection);
    // select target for better user experience.
    editor.selections = [target];
    if (isOn)
        newText = document.getText(target).replace(off, offReplace);
    else
        newText = document.getText(target).replace(on, onReplace);
    // console.log(document.getText(target));
    editTextDocument_1.editTextDocument(document, [{
            range: target,
            replace: newText
        }]);
}
exports.toggleFormat = toggleFormat;
function matchedInCursor(document, selection, rule) {
    let lines = getLines(document, selection);
    let text = document.getText(lines);
    let newLinePos = [];
    for (let i = 0; i < text.length; i++) {
        if (text.substr(i, 1) == '\n')
            newLinePos.push(i);
    }
    rule.lastIndex = 0;
    let matches;
    while (matches = rule.exec(text)) {
        let start = convertPosition(new vscode.Position(selection.start.line, matches.index), newLinePos);
        let end = convertPosition(new vscode.Position(selection.start.line, matches.index + matches[0].length), newLinePos);
        let rng = new vscode.Selection(start, end);
        if (rng.intersection(selection))
            return rng;
    }
    return undefined;
}
function convertPosition(pos, newLinePos) {
    let line = 0;
    let linePos = 0;
    newLinePos.map((p, i) => {
        if (pos.character > p) {
            line = i + 1;
            linePos = p;
        }
    });
    return new vscode.Position(line + pos.line, pos.character - linePos);
}
function getWord(document, selection) {
    let txtLine = document.lineAt(selection.active.line).text;
    let spacePreceding = txtLine.lastIndexOf(' ', selection.start.character - 1);
    let spaceFollowing = txtLine.indexOf(' ', selection.end.character);
    if (spaceFollowing == -1) {
        spaceFollowing = txtLine.length;
    }
    return new vscode.Selection(new vscode.Position(selection.active.line, spacePreceding + 1), new vscode.Position(selection.active.line, spaceFollowing));
}
function getLines(document, selection) {
    let lines = document.lineAt(selection.start).range.union(document.lineAt(selection.end).range);
    return new vscode.Selection(lines.start, lines.end);
}
//# sourceMappingURL=toggleFormat.js.map