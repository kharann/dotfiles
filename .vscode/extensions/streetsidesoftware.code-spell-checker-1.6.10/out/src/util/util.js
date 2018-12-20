"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unique(values) {
    return [...(new Set(values))];
}
exports.unique = unique;
function uniqueFilter() {
    const seen = new Set();
    return (v) => !!(!seen.has(v) && seen.add(v));
}
exports.uniqueFilter = uniqueFilter;
function freqCount(values) {
    const map = new Map();
    values.forEach(v => map.set(v, (map.get(v) || 0) + 1));
    return [...map.entries()];
}
exports.freqCount = freqCount;
//# sourceMappingURL=util.js.map