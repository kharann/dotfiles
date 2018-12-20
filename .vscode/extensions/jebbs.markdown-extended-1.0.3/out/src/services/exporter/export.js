"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const tools_1 = require("../common/tools");
const stopWatch_1 = require("../common/stopWatch");
function MarkdownExport(arg, option) {
    return __awaiter(this, void 0, void 0, function* () {
        let confs = (yield getFileList(arg)).map(uri => ({
            uri: uri,
            format: option.format,
            fileName: tools_1.calculateExportPath(uri, option.format)
        }));
        let timer = new stopWatch_1.StopWatch();
        return option.exporter.Export(confs, option.progress)
            .then(() => {
            return {
                duration: timer.stop(),
                files: confs.map(c => c.fileName)
            };
        });
    });
}
exports.MarkdownExport = MarkdownExport;
function getFileList(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        let _files = [];
        if (arg && arg instanceof vscode.Uri && arg.scheme == "file")
            return [arg];
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }
        if (!arg) {
            for (let folder of vscode.workspace.workspaceFolders) {
                _files.push(...yield getFileList(folder.uri));
            }
        }
        else if (arg instanceof Array) {
            for (let u of arg.filter(p => p instanceof vscode.Uri)) {
                _files.push(...yield getFileList(u));
            }
        }
        else if (arg instanceof vscode.Uri) {
            if (fs.statSync(arg.fsPath).isDirectory()) {
                let folder = vscode.workspace.getWorkspaceFolder(arg);
                let relPath = path.relative(folder.uri.fsPath, arg.fsPath);
                if (relPath)
                    relPath += '/';
                let files = yield vscode.workspace.findFiles(`${relPath}**/*.md`, "");
                _files.push(...files.filter(file => tools_1.isSubPath(file.fsPath, folder.uri.fsPath)));
            }
            else {
                _files.push(arg);
            }
        }
        return _files;
    });
}
//# sourceMappingURL=export.js.map