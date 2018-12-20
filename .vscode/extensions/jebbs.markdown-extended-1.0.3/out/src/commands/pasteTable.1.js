"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const vscode = require("vscode");
const clip = require("clipboardy");
const convertTable_1 = require("../services/table/convertTable");
const tools_1 = require("../services/common/tools");
class CommandPasteTable extends common_1.Command {
    execute() {
        let text = clip.readSync().trim();
        if (!text)
            return;
        let tableText = convertTable_1.convertToMarkdownTable(text);
        if (!tableText)
            return;
        let editor = vscode.window.activeTextEditor;
        tools_1.editTextDocument(editor.document, editor.selection, tableText);
    }
    constructor() {
        super("markdownExtended.pasteAsTable");
    }
}
exports.CommandPasteTable = CommandPasteTable;
//# sourceMappingURL=pasteTable.1.js.map