"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../services/common/config");
let initialized = false;
const VAR_REG = /%(\w+)%/ig;
function MarkdownItVars(md) {
    if (initialized) {
        // console.log("initialized, but reuqested again")
        return;
    }
    let oldRender = md.render;
    let oldrenderInline = md.renderInline;
    md.render = (m, env) => applyVars(oldRender.call(md, m, env));
    md.renderInline = (m, env) => applyVars(oldrenderInline.call(md, m, env));
    initialized = true;
}
exports.MarkdownItVars = MarkdownItVars;
function applyVars(result) {
    let matches;
    let used = new Set();
    while (matches = VAR_REG.exec(result)) {
        used.add(matches[1]);
    }
    if (!used.size)
        return result;
    let vars = config_1.config.vars;
    used.forEach(v => {
        if (vars[v] !== undefined)
            result = result.replace(VAR_REG, vars[v]);
    });
    return result;
}
//# sourceMappingURL=markdownItVars.js.map