"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const vscode = require("vscode");
const clip = require("clipboardy");
const exportFile_1 = require("../services/exporter/exportFile");
class CommandCopy extends common_1.Command {
    execute() {
        if (!exportFile_1.testMarkdown())
            return;
        clip.write(renderMarkdown(false))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy");
    }
}
exports.CommandCopy = CommandCopy;
class CommandCopyWithStyles extends common_1.Command {
    execute() {
        if (!exportFile_1.testMarkdown())
            return;
        clip.write(renderMarkdown(true))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy.withStyle");
    }
}
exports.CommandCopyWithStyles = CommandCopyWithStyles;
function renderMarkdown(style) {
    let document = vscode.window.activeTextEditor.document;
    let selection = vscode.window.activeTextEditor.selection;
    let rendered = "";
    if (selection.isEmpty)
        rendered = exportFile_1.renderHTML(document);
    else
        rendered = exportFile_1.renderHTML(document.getText(selection));
    if (style)
        rendered += '\n' + exportFile_1.renderStyle();
    return rendered;
}
//# sourceMappingURL=copy.1.js.map