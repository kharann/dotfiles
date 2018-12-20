"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdTable_1 = require("./mdTable");
function parseMDTAble(source) {
    let lines = source.replace(/\r?\n/g, "\n").split("\n");
    if (lines.length < 2)
        return undefined; //should have at least two line
    let header = lines.shift();
    let sepLine = lines.shift();
    lines.unshift(header);
    let sepRow = getColumns(sepLine);
    if (!testSepRow(sepRow))
        return undefined;
    let data = lines.map(line => getColumns(line));
    let table = new mdTable_1.MDTable(data);
    let aligns = parseAlins(sepRow);
    if (table.columnCount > aligns.length)
        aligns.push(...new Array(table.columnCount - aligns.length).fill(mdTable_1.TableAlign.auto));
    table.aligns = aligns;
    return table;
}
exports.parseMDTAble = parseMDTAble;
function splitColumns(line) {
    let cells = [];
    let start = 0;
    for (let i = 0; i < line.length; i++) {
        let chr = line.substr(i, 1);
        if (chr == '\\') {
            i++;
            continue;
        }
        else if (chr == '|') {
            cells.push(line.substring(start, i));
            start = i + 1;
        }
    }
    cells.push(line.substring(start, line.length));
    return cells;
}
exports.splitColumns = splitColumns;
function getColumns(line) {
    let cells = splitColumns(line).map(c => c.trim());
    if (!cells[0].trim())
        cells.shift();
    if (cells.length && !cells[cells.length - 1].trim())
        cells.pop();
    return cells;
}
function testSepRow(row) {
    return row.reduce((p, c) => {
        if (!p)
            return false;
        return /^:?-+:?$/i.test(c.trim());
    }, true);
}
function parseAlins(row) {
    return row.map(c => {
        let str = c.trim();
        let left = str.substr(0, 1) == ":";
        let right = str.substr(str.length - 1, 1) == ":";
        if (left && right)
            return mdTable_1.TableAlign.center;
        if (left)
            return mdTable_1.TableAlign.left;
        if (right)
            return mdTable_1.TableAlign.right;
        return mdTable_1.TableAlign.auto;
    });
}
//# sourceMappingURL=mdTableParse.js.map