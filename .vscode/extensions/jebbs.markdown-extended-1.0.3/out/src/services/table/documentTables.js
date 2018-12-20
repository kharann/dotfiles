"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdTableParse_1 = require("./mdTableParse");
function tablesOf(document) {
    let tables = [];
    for (let i = 0; i < document.lineCount; i++) {
        if (testSepRow(document.lineAt(i).text)) {
            let t = findTable(document, i - 1);
            if (t) {
                tables.push(t);
                i = t.range.end.line;
            }
        }
    }
    return tables;
}
exports.tablesOf = tablesOf;
function findTable(document, pos) {
    if (pos < 0 || pos > document.lineCount - 2)
        return undefined;
    let i = 0;
    for (i = pos + 2; i < document.lineCount; i++) {
        if (document.lineAt(i).text.indexOf('|') < 0)
            break;
    }
    i--;
    let rang = document.lineAt(pos).range.union(document.lineAt(i).range);
    let table = mdTableParse_1.parseMDTAble(document.getText(rang));
    if (table)
        return { range: rang, table: table };
    else
        return undefined;
}
function testSepRow(row) {
    if (!row.trim())
        return false;
    let cells = row.split("|");
    if (cells.length < 2)
        return false;
    if (!cells[0].trim())
        cells.shift();
    if (!cells[cells.length - 1].trim())
        cells.pop();
    return cells.reduce((p, c) => {
        if (!p)
            return false;
        return /:?-+:?/i.test(c);
    }, true);
}
//# sourceMappingURL=documentTables.js.map