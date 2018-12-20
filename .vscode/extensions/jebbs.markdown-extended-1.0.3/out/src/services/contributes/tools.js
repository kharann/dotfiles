"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
/**
 * create contribute item by given file
 * @param file file to read
 * @param isStyle specifies the file is style or not
 */
function readContributeFile(file, isStyle) {
    if (!fs.existsSync(file))
        return "";
    let buf = fs.readFileSync(file);
    if (!buf || !buf.length)
        return "";
    return createContributeItem(buf, isStyle, path.basename(file));
}
exports.readContributeFile = readContributeFile;
/**
 * create contribute item by given content
 * @param content css styles or javascript content to create
 * @param isStyle specifies the content is style or not
 * @param comment comment to put beside the contribute item
 */
function createContributeItem(content, isStyle, comment) {
    if (!content)
        return "";
    let b64 = content instanceof Buffer ?
        content.toString("base64") :
        new Buffer(content).toString("base64");
    let cmt = comment ? `<!-- ${comment} -->\n` : "";
    if (isStyle) {
        return cmt + `<link rel="stylesheet" type="text/css" href="data:text/css;base64,${b64}"/>`;
    }
    else {
        return cmt + `<script type="text/javascript" src="data:text/javascript;base64,${b64}"/></script>`;
    }
}
exports.createContributeItem = createContributeItem;
//# sourceMappingURL=tools.js.map