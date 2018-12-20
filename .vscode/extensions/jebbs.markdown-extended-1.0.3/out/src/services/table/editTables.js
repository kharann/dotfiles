"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const documentTables_1 = require("./documentTables");
const editTable_1 = require("./editTable");
const editTextDocument_1 = require("../common/editTextDocument");
function editTables(et, tt, before) {
    let editor = vscode.window.activeTextEditor;
    let document = editor.document;
    let selection = editor.selection;
    let tables = documentTables_1.tablesOf(document).filter(t => t.range.intersection(selection));
    if (!tables || !tables.length)
        return;
    editTextDocument_1.editTextDocument(editor.document, tables.map(tb => editTable_1.getTableEdit(editor, tb, et, tt, before)));
}
exports.editTables = editTables;
//# sourceMappingURL=editTables.js.map