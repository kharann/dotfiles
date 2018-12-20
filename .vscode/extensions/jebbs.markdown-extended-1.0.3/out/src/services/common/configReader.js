"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ConfigReader extends vscode.Disposable {
    constructor(section) {
        super(() => this.dispose());
        this._folderConfs = {};
        this._section = section;
        this.getConfObjects(section);
        this._disposable = vscode.workspace.onDidChangeConfiguration(e => {
            this.onChange(e);
            this.getConfObjects(section);
        });
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    read(key, ...para) {
        if (!para || !para.length || !para[0])
            return this._conf.get(key); // no uri? return global value.
        let uri = para.shift();
        let folder = vscode.workspace.getWorkspaceFolder(uri);
        if (!folder || !folder.uri)
            return this._conf.get(key); // new file or not current workspace file? return global value.
        let folderConf = this._folderConfs[folder.uri.fsPath];
        if (!folderConf) {
            folderConf = vscode.workspace.getConfiguration(this._section, folder.uri);
            this._folderConfs[folder.uri.fsPath] = folderConf;
        }
        let results = folderConf.inspect(key);
        let func = undefined;
        if (para.length)
            func = para.shift();
        let value = undefined;
        if (results.workspaceFolderValue !== undefined)
            value = results.workspaceFolderValue;
        else if (results.workspaceValue !== undefined)
            value = results.workspaceValue;
        else if (results.globalValue !== undefined)
            value = results.globalValue;
        else
            value = results.defaultValue;
        if (func && folder && folder.uri)
            return func(folder.uri, value);
        return value;
    }
    getConfObjects(configName) {
        this._conf = vscode.workspace.getConfiguration(configName);
        this._folderConfs = {};
        if (!vscode.workspace.workspaceFolders)
            return;
        vscode.workspace.workspaceFolders.map(f => this._folderConfs[f.uri.fsPath] = vscode.workspace.getConfiguration(configName, f.uri));
    }
}
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=configReader.js.map