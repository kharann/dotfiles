"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
const vscode = require("vscode");
const clip = require("clipboardy");
const convertTable_1 = require("../services/table/convertTable");
const editTextDocument_1 = require("../services/common/editTextDocument");
class CommandPasteTable extends command_1.Command {
    execute() {
        let text = clip.readSync().trim();
        if (!text)
            return;
        let tableText = convertTable_1.convertToMarkdownTable(text);
        if (!tableText)
            return;
        let editor = vscode.window.activeTextEditor;
        editTextDocument_1.editTextDocument(editor.document, [{
                range: editor.selection,
                replace: tableText
            }]);
    }
    constructor() {
        super("markdownExtended.pasteAsTable");
    }
}
exports.CommandPasteTable = CommandPasteTable;
//# sourceMappingURL=pasteTable.js.map