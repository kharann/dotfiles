"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdTable_1 = require("./mdTable");
const tools_1 = require("../common/tools");
function stringifyMDTable(table, compact, padding) {
    padding = padding || 1;
    let rows = table.data.map(row => stringifyRow(row, table.columnWidths, table.aligns, compact, padding));
    let header = rows.shift();
    let Sep = stringifyHeaderSeperator(table, compact, padding);
    return header + '\n'
        + Sep + '\n'
        + rows.join('\n');
}
exports.stringifyMDTable = stringifyMDTable;
function stringifyHeaderSeperator(table, compact, padding) {
    let colCount = table.data[0].length;
    return [...Array(colCount).keys()].reduce((p, i) => p + formatHeaderCell(table.aligns[i], table.columnWidths[i], compact, padding) + "|", "|");
}
function stringifyRow(row, columnWidths, aligns, compact, padding) {
    return row.reduce((p, c, i) => {
        return p + (compact ? c : formatCell(c, columnWidths[i], aligns[i], padding)) + "|";
    }, "|");
}
function formatHeaderCell(align, columnWidth, compact, padding) {
    switch (align) {
        case mdTable_1.TableAlign.center:
            if (compact)
                return ":-:";
            return addPadding(":" + "-".repeat(columnWidth - 2) + ":", padding, padding);
        case mdTable_1.TableAlign.left:
            if (compact)
                return ":-";
            return addPadding(":" + "-".repeat(columnWidth - 1), padding, padding);
        case mdTable_1.TableAlign.right:
            if (compact)
                return "-:";
            return addPadding("-".repeat(columnWidth - 1) + ":", padding, padding);
        case mdTable_1.TableAlign.auto:
        default:
            if (compact)
                return "-";
            return addPadding("-".repeat(columnWidth), padding, padding);
    }
}
function formatCell(cell, width, align, padding) {
    let leftPadding = padding;
    let rightPadding = padding;
    switch (align) {
        case mdTable_1.TableAlign.center:
            leftPadding += ~~((width - tools_1.MonoSpaceLength(cell)) / 2);
            rightPadding += ~~((width - tools_1.MonoSpaceLength(cell)) / 2);
            if (leftPadding + rightPadding != width - tools_1.MonoSpaceLength(cell) + padding * 2)
                rightPadding += 1;
            break;
        case mdTable_1.TableAlign.left:
            rightPadding += (width - tools_1.MonoSpaceLength(cell));
            break;
        case mdTable_1.TableAlign.right:
            leftPadding += (width - tools_1.MonoSpaceLength(cell));
            break;
        case mdTable_1.TableAlign.auto:
        default:
            rightPadding += (width - tools_1.MonoSpaceLength(cell));
            break;
    }
    return addPadding(cell.trim(), leftPadding, rightPadding);
}
function addPadding(cell, left, right) {
    const SPACE = " ";
    return SPACE.repeat(left) + cell.trim() + SPACE.repeat(right);
}
//# sourceMappingURL=mdTableStringify.js.map