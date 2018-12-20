"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
const vscode = require("vscode");
const editTextDocument_1 = require("../services/common/editTextDocument");
const documentTables_1 = require("../services/table/documentTables");
class CommandFormateTable extends command_1.Command {
    execute() {
        let editor = vscode.window.activeTextEditor;
        let selection = editor.selection;
        let tables = documentTables_1.tablesOf(editor.document);
        let edits = [];
        tables.map(t => {
            if (t.range.intersection(selection))
                edits.push({ range: t.range, replace: t.table.stringify() });
        });
        editTextDocument_1.editTextDocument(editor.document, edits);
    }
    constructor() {
        super("markdownExtended.formateTable");
    }
}
exports.CommandFormateTable = CommandFormateTable;
//# sourceMappingURL=formateTable.js.map