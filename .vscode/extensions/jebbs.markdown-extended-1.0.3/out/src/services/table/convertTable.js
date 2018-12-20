"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require("./csv");
const mdTable = require("./mdTable");
function convertToMarkdownTable(source) {
    let table = mdTable.MDTable.parse(source);
    if (table)
        return table.stringify();
    table = csv.parse(source);
    if (!table)
        return undefined;
    return table.stringify();
}
exports.convertToMarkdownTable = convertToMarkdownTable;
//# sourceMappingURL=convertTable.js.map