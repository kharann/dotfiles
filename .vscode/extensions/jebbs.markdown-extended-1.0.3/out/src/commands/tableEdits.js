"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
const editTables_1 = require("../services/table/editTables");
const editTable_1 = require("../services/table/editTable");
const cmds = [
    {
        commandId: "markdownExtended.addRowAbove",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.add, editTable_1.targetType.row, true]
    },
    {
        commandId: "markdownExtended.addRowBelow",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.add, editTable_1.targetType.row, false]
    },
    {
        commandId: "markdownExtended.DeleteRow",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.delete, editTable_1.targetType.row]
    },
    {
        commandId: "markdownExtended.addColumnLeft",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.add, editTable_1.targetType.column, true]
    },
    {
        commandId: "markdownExtended.addColumnRight",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.add, editTable_1.targetType.column, false]
    },
    {
        commandId: "markdownExtended.DeleteColumn",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.delete, editTable_1.targetType.column]
    },
    {
        commandId: "markdownExtended.MoveColumnLeft",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.move, editTable_1.targetType.column, true]
    },
    {
        commandId: "markdownExtended.MoveColumnRight",
        worker: editTables_1.editTables,
        args: [editTable_1.editType.move, editTable_1.targetType.column, false]
    },
];
exports.commandTableEdits = new commands_1.Commands(cmds);
//# sourceMappingURL=tableEdits.js.map