"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const tools_1 = require("../services/common/tools");
class Commands extends vscode_1.Disposable {
    constructor(cmds) {
        super(() => this.dispose());
        this.cmds = cmds;
        this._disposables = [];
        this._disposables.push(...cmds.map(cmd => vscode_1.commands.registerCommand(cmd.commandId, this.makeExecutor(cmd.worker, ...cmd.args))));
    }
    dispose() {
        this._disposables && this._disposables.length && this._disposables.map(d => d.dispose());
    }
    makeExecutor(func, ...args) {
        return () => {
            try {
                let pm = func(...args);
                if (pm instanceof Promise) {
                    pm.catch(error => tools_1.showMessagePanel(error));
                }
            }
            catch (error) {
                tools_1.showMessagePanel(error);
            }
        };
    }
}
exports.Commands = Commands;
//# sourceMappingURL=commands.js.map