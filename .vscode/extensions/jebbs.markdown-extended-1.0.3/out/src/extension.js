'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const exportCurrent_1 = require("./commands/exportCurrent");
const plugins_1 = require("./plugin/plugins");
const copy_1 = require("./commands/copy");
const config_1 = require("./services/common/config");
const mdConfig_1 = require("./services/contributes/mdConfig");
const pasteTable_1 = require("./commands/pasteTable");
const formateTable_1 = require("./commands/formateTable");
const toggleFormats_1 = require("./commands/toggleFormats");
const tableEdits_1 = require("./commands/tableEdits");
const exportWorkspace_1 = require("./commands/exportWorkspace");
exports.outputPanel = vscode.window.createOutputChannel("MDExtended");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(ctx) {
    exports.context = ctx;
    ctx.subscriptions.push(exports.outputPanel, config_1.config, mdConfig_1.mdConfig, toggleFormats_1.commandToggles, tableEdits_1.commandTableEdits, new exportCurrent_1.CommandExportCurrent(), new exportWorkspace_1.CommandExportWorkSpace(), new copy_1.CommandCopy(), new copy_1.CommandCopyWithStyles(), new pasteTable_1.CommandPasteTable(), new formateTable_1.CommandFormateTable());
    return {
        extendMarkdownIt(md) {
            plugins_1.plugins.map(p => {
                md.use(p.plugin, ...(p.params || []));
            });
            exports.markdown = md;
            return md;
        }
    };
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map