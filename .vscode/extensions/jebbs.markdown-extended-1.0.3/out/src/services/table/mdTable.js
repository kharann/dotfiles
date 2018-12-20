"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdTableParse_1 = require("./mdTableParse");
const mdTableStringify_1 = require("./mdTableStringify");
const tools_1 = require("../common/tools");
var TableAlign;
(function (TableAlign) {
    TableAlign[TableAlign["auto"] = 0] = "auto";
    TableAlign[TableAlign["left"] = 1] = "left";
    TableAlign[TableAlign["center"] = 2] = "center";
    TableAlign[TableAlign["right"] = 3] = "right";
})(TableAlign = exports.TableAlign || (exports.TableAlign = {}));
class MDTable {
    constructor(data) {
        this.data = data;
    }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
        this._rowCount = this._data.length;
        this.alignColumns();
        this._aligns = data[0].map(() => TableAlign.auto);
        this._columnWidths = this.calcColumnWidths();
    }
    get columnCount() {
        return this._columnCount;
    }
    get rowCount() {
        return this._rowCount;
    }
    get aligns() {
        return this._aligns;
    }
    set aligns(aligns) {
        if (this._data[0].length !== aligns.length)
            throw new Error("Align settings count and column count mismatch!");
        this._aligns = aligns;
    }
    get columnWidths() {
        return this._columnWidths;
    }
    static parse(source) {
        return mdTableParse_1.parseMDTAble(source);
    }
    stringify(compact, padding) {
        return mdTableStringify_1.stringifyMDTable(this, compact, padding);
    }
    addRow(pos, count) {
        if (pos < 0)
            return;
        this._data.splice(pos + 1, 0, ...new Array(count).fill(new Array(this.columnCount).fill("")));
        this._rowCount += count;
    }
    deleteRow(pos, count) {
        if (pos < 0)
            return;
        this._data.splice(pos + 1, count);
        this._rowCount -= count;
    }
    moveRow(start, count, offset) {
        if (start < 0 || count == 0 || offset == 0)
            return;
        this.moveArray(this._data, start, count, offset);
    }
    moveColumn(start, count, offset) {
        if (start < 0 || count == 0 || offset == 0)
            return;
        for (let i = 0; i < this._data.length; i++) {
            this.moveArray(this._data[i], start, count, offset);
        }
        this.moveArray(this._aligns, start, count, offset);
        this.moveArray(this._columnWidths, start, count, offset);
    }
    addColumn(pos, count) {
        if (pos < 0)
            return;
        for (let i = 0; i < this._data.length; i++) {
            this._data[i].splice(pos, 0, ...new Array(count).fill(""));
        }
        this._aligns.splice(pos, 0, ...new Array(count).fill(TableAlign.auto));
        this._columnWidths.splice(pos, 0, ...new Array(count).fill(1));
        this._columnCount += count;
    }
    deleteColumn(pos, count) {
        if (pos < 0)
            return;
        for (let i = 0; i < this._data.length; i++) {
            this._data[i].splice(pos, count);
        }
        this._aligns.splice(pos, count);
        this._columnWidths.splice(pos, count);
        this._columnCount -= count;
    }
    calcColumnWidths() {
        return [...Array(this._data[0].length).keys()].map(i => {
            let ws = this._data.map(row => {
                return i > row.length - 1 ? 0 : tools_1.MonoSpaceLength(row[i]);
            });
            switch (this._aligns[i]) {
                case TableAlign.left:
                case TableAlign.right:
                    ws.push(2);
                    break;
                case TableAlign.center:
                    ws.push(3);
                    break;
                case TableAlign.auto:
                default:
                    ws.push(1);
                    break;
            }
            return Math.max(...ws);
        });
    }
    alignColumns() {
        this._columnCount = Math.max(...this._data.map(row => row.length));
        this._data.map(row => {
            if (row.length < this._columnCount)
                row.push(...new Array(this._columnCount - row.length).fill(""));
        });
    }
    moveArray(arr, start, count, offset) {
        let moving = arr.splice(start, count);
        arr.splice(start + offset, 0, ...moving);
        return arr;
    }
}
exports.MDTable = MDTable;
//# sourceMappingURL=mdTable.js.map