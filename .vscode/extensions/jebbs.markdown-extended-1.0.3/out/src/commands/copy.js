"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
const vscode = require("vscode");
const clip = require("clipboardy");
const shared_1 = require("../services/exporter/shared");
const markdownDocument_1 = require("../services/common/markdownDocument");
class CommandCopy extends command_1.Command {
    execute() {
        if (!shared_1.testMarkdown())
            return;
        clip.write(renderMarkdown(false))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy");
    }
}
exports.CommandCopy = CommandCopy;
class CommandCopyWithStyles extends command_1.Command {
    execute() {
        if (!shared_1.testMarkdown())
            return;
        clip.write(renderMarkdown(true))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copyWithStyle");
    }
}
exports.CommandCopyWithStyles = CommandCopyWithStyles;
function renderMarkdown(style) {
    let document = vscode.window.activeTextEditor.document;
    let selection = vscode.window.activeTextEditor.selection;
    let rendered = "";
    let doc;
    if (selection.isEmpty)
        doc = new markdownDocument_1.MarkdownDocument(document);
    else
        doc = new markdownDocument_1.MarkdownDocument(document, document.getText(selection));
    if (style)
        rendered = shared_1.renderPage(doc);
    else
        rendered = shared_1.renderHTML(doc);
    return rendered;
}
//# sourceMappingURL=copy.js.map