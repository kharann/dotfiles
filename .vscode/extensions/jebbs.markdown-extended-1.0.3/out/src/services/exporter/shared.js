"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const extension_1 = require("../../extension");
const markdownDocument_1 = require("../common/markdownDocument");
const template_1 = require("./template");
const contributes_1 = require("../contributes/contributes");
function renderPage(document, injectStyle) {
    let doc = undefined;
    if (document instanceof markdownDocument_1.MarkdownDocument)
        doc = document;
    else if (document.getText)
        doc = new markdownDocument_1.MarkdownDocument(document);
    let title = path.basename(doc.document.uri.fsPath);
    let styles = getStyles(doc.document.uri, injectStyle);
    let scripts = getSciprts();
    let html = renderHTML(doc);
    //should put both classes, because we cannot determine if a user style URL is a theme or not
    let mdClass = "vscode-body vscode-light";
    return eval(template_1.template);
}
exports.renderPage = renderPage;
function renderHTML(doc) {
    let env = {
        htmlExporter: {
            workspaceFolder: getworkspaceFolder(doc.document.uri),
            vsUri: getVsUri(doc.document.uri),
            embedImage: true,
        }
    };
    let content = extension_1.markdown.render(doc.content, env);
    return content.trim();
}
exports.renderHTML = renderHTML;
function getworkspaceFolder(uri) {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    return (root && root.uri) ? root.uri.fsPath : "";
}
function getVsUri(uri) {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    let p = (root && root.uri) ? '/' + root.uri.fsPath + '/' : "";
    // FIXME: vscode has a bug encoding shared path, which cannot be replaced
    // nor can vscode display images if workspace is in a shared folder.
    // FIXME: can special chr exists in uri that need escape when use regex?
    return "vscode-resource:" + encodeURI(p.replace(/[\\/]+/g, '/'));
}
function getStyles(uri, injectStyle) {
    let styles = [];
    let official = contributes_1.Contributes.Styles.official();
    let thirdParty = contributes_1.Contributes.Styles.thirdParty();
    let user = contributes_1.Contributes.Styles.user(uri);
    if (injectStyle) {
        styles.push("");
        styles.push(contributes_1.Contributes.createStyle(injectStyle, "injected by exporter"));
    }
    if (official) {
        styles.push("");
        styles.push("<!-- official styles start -->");
        styles.push(official);
        styles.push("<!-- official styles end -->");
    }
    if (thirdParty) {
        styles.push("");
        styles.push("<!-- third party styles start -->");
        styles.push(thirdParty);
        styles.push("<!-- third party styles end -->");
    }
    if (user) {
        styles.push("");
        styles.push("<!-- user styles start -->");
        styles.push(user);
        styles.push("<!-- user styles end -->");
    }
    styles.push("");
    return styles.join('\n');
}
function getSciprts() {
    let scripts = [];
    // let official = Contributes.Scripts.official();
    let thirdParty = contributes_1.Contributes.Scripts.thirdParty();
    // if (official) {
    //     scripts.push("");
    //     scripts.push("<!-- official scripts start -->");
    //     scripts.push(official);
    //     scripts.push("<!-- official scripts end -->");
    // }
    if (thirdParty) {
        scripts.push("");
        scripts.push("<!-- third party scripts start -->");
        scripts.push(thirdParty);
        scripts.push("<!-- third party scripts end -->");
    }
    scripts.push("");
    return scripts.join('\n');
}
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
//# sourceMappingURL=shared.js.map