"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const tools_1 = require("../common/tools");
const path = require("path");
const shared_1 = require("./shared");
function exportHTML(document, fileName) {
    tools_1.mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, shared_1.renderHTML(document) + "\n" + shared_1.renderStyle(document.uri), "utf-8");
}
//# sourceMappingURL=exportFile.js.map