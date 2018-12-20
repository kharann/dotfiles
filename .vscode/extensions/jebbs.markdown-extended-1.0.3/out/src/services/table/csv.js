"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require("papaparse");
const mdTable_1 = require("./mdTable");
function parse(source) {
    let table = csv.parse(source);
    if (table.errors.length)
        return undefined;
    //use "new MDTable(table.data)" to do the data regularization, then escape chr
    let data = escapeChars(new mdTable_1.MDTable(table.data));
    return new mdTable_1.MDTable(data);
}
exports.parse = parse;
function stringify(table) {
    let config = {
        quotes: false,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: "\t",
        header: true,
        newline: "\r\n"
    };
    return csv.unparse(table.data, config);
}
exports.stringify = stringify;
function escapeChars(table) {
    for (let i = 0; i < table.rowCount; i++) {
        for (let j = 0; j < table.columnCount; j++) {
            let text = table.data[i][j];
            if (/[\\|]/g.test(text))
                table.data[i][j] = text.replace(/([\\|])/g, "\\$1");
        }
    }
    return table.data;
}
//# sourceMappingURL=csv.js.map