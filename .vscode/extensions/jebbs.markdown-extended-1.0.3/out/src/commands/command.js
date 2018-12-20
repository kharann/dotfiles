"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const tools_1 = require("../services/common/tools");
class Command extends vscode_1.Disposable {
    constructor(command) {
        super(() => this.dispose());
        this.command = command;
        this._disposable = vscode_1.commands.registerCommand(command, this.executeCatch, this);
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    executeCatch(...args) {
        try {
            let pm = this.execute(...args);
            if (pm instanceof Promise) {
                pm.catch(error => tools_1.showMessagePanel(error));
            }
        }
        catch (error) {
            tools_1.showMessagePanel(error);
        }
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map