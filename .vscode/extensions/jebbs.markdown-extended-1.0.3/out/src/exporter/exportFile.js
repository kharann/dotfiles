"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const styles_1 = require("../common/styles");
const tools_1 = require("../common/tools");
const path = require("path");
const pdf = require("html-pdf");
const config_1 = require("../common/config");
const extension_1 = require("../extension");
function exportFormats() {
    let formats = [
        "HTML",
    ];
    if (config_1.config.phantomPath && fs.existsSync(config_1.config.phantomPath))
        formats.push("PDF", "JPEG", "PNG");
    return formats;
}
exports.exportFormats = exportFormats;
function exportFile(document, format, fileName, callback) {
    switch (format) {
        case "HTML":
            exportHTML(document, fileName);
            callback();
            break;
        case "PDF":
        case "JPEG":
        case "PNG":
            exportPDF(document, fileName, format, callback);
            break;
    }
}
exports.exportFile = exportFile;
function exportHTML(document, fileName) {
    tools_1.mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, renderHTML(document) + "\n" + renderStyle(), "utf-8");
}
function exportPDF(document, fileName, format, callback) {
    tools_1.mkdirsSync(path.dirname(fileName));
    let mdBody = renderHTML(document);
    let option = {};
    const imgWidth = 980;
    switch (format) {
        case "PDF":
            option = {
                // height: "29.665cm",
                // width: "20.988cm",
                format: "A4",
                // border: {
                //     top: "1cm",
                //     right: "1cm",
                //     bottom: "1cm",
                //     left: "1cm"
                // },
                type: "pdf"
            };
            break;
        case "JPEG":
        case "PNG":
            option = {
                type: format.toLowerCase()
            };
            mdBody = `<body style="width:${imgWidth}px">${mdBody}</body>`;
            break;
    }
    option.phantomPath = config_1.config.phantomPath;
    pdf.create(mdBody + "\n" + renderStyle(), option).toFile(fileName, callback);
}
function renderHTML(para) {
    let content = "";
    if (typeof para === "string")
        content = extension_1.markdown.render(para);
    else if (para.getText)
        content = extension_1.markdown.render(para.getText());
    return `<article class="markdown-body vscode-body">
    ${content.trim()}
</article>`;
}
exports.renderHTML = renderHTML;
function renderStyle() {
    return `<style>\n${styles_1.pluginStyles}\n</style>`;
}
exports.renderStyle = renderStyle;
function testMarkdown() {
    if (!extension_1.markdown) {
        vscode.window.showInformationMessage("You must open markdown preview before you can copy or export.", "Open Preview").then(result => {
            if (result == "Open Preview")
                vscode.commands.executeCommand("markdown.showPreviewToSide");
        });
        return false;
    }
    return true;
}
exports.testMarkdown = testMarkdown;
//# sourceMappingURL=exportFile.js.map