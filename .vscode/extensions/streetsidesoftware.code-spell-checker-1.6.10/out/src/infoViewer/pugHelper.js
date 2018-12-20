"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_1 = require("../util/perf");
perf_1.performance.mark('pugHelper.ts');
const path = require("path");
perf_1.performance.mark('pugHelper.ts 1');
const cache = new Map();
const baseDir = __dirname.replace(/(?:out.)?src.*$/, '');
exports.templateDir = path.join(baseDir, 'templates');
function compile(templateName) {
    if (!cache.has(templateName)) {
        perf_1.performance.mark('pugHelper.ts compile');
        const pug = require('pug');
        const filename = path.join(exports.templateDir, templateName);
        cache.set(templateName, pug.compileFile(filename));
        perf_1.performance.mark('pugHelper.ts compile done');
        perf_1.performance.measure(`pugHelper.ts compile: ${templateName}`, 'pugHelper.ts compile', 'pugHelper.ts compile done');
    }
    return cache.get(templateName);
}
exports.compile = compile;
function render(templateName, params) {
    const fn = compile(templateName);
    return fn(Object.assign({}, params, { templateDir: exports.templateDir }));
}
exports.render = render;
perf_1.performance.mark('pugHelper.ts done.');
//# sourceMappingURL=pugHelper.js.map