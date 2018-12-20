"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode = require("vscode");
const infoViewer = require("./infoViewer");
const util_1 = require("./util");
function initStatusBar(context, client) {
    const sbCheck = vscode_1.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    let lastUri = '';
    function updateStatusBarWithSpellCheckStatus(document) {
        sbCheck.color = new vscode_1.ThemeColor('statusBar.foreground');
        sbCheck.text = '$(clock)';
        sbCheck.tooltip = 'cSpell waiting...';
        sbCheck.show();
        if (!document)
            return;
        const { uri, languageId = '' } = document;
        lastUri = uri.toString();
        const genOnOffIcon = (on) => on ? '$(checklist)' : '$(stop)';
        client.isSpellCheckEnabled(document)
            .then((response) => {
            const { activeTextEditor } = vscode_1.window;
            const document = activeTextEditor && activeTextEditor.document;
            const docUri = document && document.uri;
            if (docUri === uri || !docUri || docUri.scheme !== 'file') {
                const { languageEnabled = true, fileEnabled = true } = response;
                const isChecked = languageEnabled && fileEnabled;
                const isCheckedText = isChecked ? 'is' : 'is NOT';
                const langReason = languageEnabled ? '' : `The "${languageId}" language is not enabled.`;
                const fileReason = fileEnabled ? '' : `The file path is excluded in settings.`;
                const fileName = path.basename(uri.fsPath);
                const langText = `${genOnOffIcon(languageEnabled)} ${languageId}`;
                const fileText = `${genOnOffIcon(fileEnabled)} ${fileName}`;
                const reason = [`"${fileName}" ${isCheckedText} spell checked.`, langReason, fileReason].filter(a => !!a).join(' ');
                sbCheck.text = `${langText} | ${fileText}`;
                sbCheck.tooltip = reason;
                sbCheck.command = infoViewer.commandDisplayCSpellInfo;
                sbCheck.show();
            }
        });
    }
    function updateStatusBar(doc) {
        const document = util_1.isSupportedDoc(doc) ? doc : selectDocument();
        const settings = vscode_1.workspace.getConfiguration().get('cSpell');
        const { enabled, showStatus = true } = settings;
        if (!showStatus) {
            sbCheck.hide();
            return;
        }
        if (enabled) {
            updateStatusBarWithSpellCheckStatus(document);
        }
        else {
            sbCheck.text = '$(stop) cSpell';
            sbCheck.tooltip = 'Enable spell checking';
            sbCheck.command = 'cSpell.enableForWorkspace';
            sbCheck.show();
        }
    }
    function onDidChangeActiveTextEditor(e) {
        updateStatusBar(e && e.document);
    }
    function onDidChangeConfiguration() {
        updateStatusBar();
    }
    function isViableEditor(e) {
        if (!e)
            return false;
        const document = e.document;
        return document &&
            document.uri &&
            util_1.isSupportedUri(document.uri);
    }
    function selectDocument() {
        if (isViableEditor(vscode_1.window.activeTextEditor)) {
            return vscode_1.window.activeTextEditor.document;
        }
        const docs = vscode_1.workspace.textDocuments
            .filter(util_1.isSupportedDoc);
        if (lastUri) {
            const candidate = docs
                .filter(document => document.uri.toString() === lastUri)
                .shift();
            if (candidate)
                return candidate;
        }
        return docs.shift();
    }
    sbCheck.text = '$(clock)';
    sbCheck.show();
    context.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor), vscode_1.workspace.onDidChangeConfiguration(onDidChangeConfiguration), vscode_1.workspace.onDidCloseTextDocument(onDidChangeConfiguration), sbCheck);
    if (vscode_1.window.activeTextEditor) {
        onDidChangeActiveTextEditor(vscode_1.window.activeTextEditor);
    }
}
exports.initStatusBar = initStatusBar;
//# sourceMappingURL=statusbar.js.map