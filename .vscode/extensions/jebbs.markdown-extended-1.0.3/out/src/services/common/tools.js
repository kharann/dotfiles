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
const extension_1 = require("../../extension");
const config_1 = require("./config");
function calculateExportPath(uri, format) {
    let outDirName = config_1.config.exportOutDirName;
    let dir = "";
    let folder = vscode.workspace.getWorkspaceFolder(uri);
    let wkdir = folder ? folder.uri.fsPath : "";
    //if current document is in workspace, organize exports in 'out' directory.
    //if not, export beside the document.
    if (wkdir && isSubPath(uri.fsPath, wkdir))
        dir = path.join(wkdir, outDirName);
    let exportDir = path.dirname(uri.fsPath);
    if (!path.isAbsolute(exportDir))
        return "";
    if (dir && wkdir) {
        let temp = path.relative(wkdir, exportDir);
        exportDir = path.join(dir, temp);
    }
    return path.join(exportDir, path.basename(uri.fsPath, ".md") + `.${format.toLowerCase()}`);
}
exports.calculateExportPath = calculateExportPath;
function isSubPath(from, to) {
    let rel = path.relative(to, from);
    return !(path.isAbsolute(rel) || rel.substr(0, 2) == "..");
}
exports.isSubPath = isSubPath;
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        }
        else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}
exports.mkdirs = mkdirs;
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
exports.mkdirsSync = mkdirsSync;
function parseError(error) {
    let nb = new Buffer("");
    if (typeof (error) === "string") {
        return error;
    }
    else if (error instanceof TypeError || error instanceof Error) {
        let err = error;
        return err.message + '\n' + err.stack;
    }
    else if (error instanceof Array) {
        let arrs = error;
        return arrs.reduce((p, err) => p + '\n\n' + err.message + '\n' + err.stack, "");
    }
    else {
        return error.toString();
    }
}
exports.parseError = parseError;
function showMessagePanel(message) {
    extension_1.outputPanel.clear();
    extension_1.outputPanel.appendLine(parseError(message));
    extension_1.outputPanel.show();
}
exports.showMessagePanel = showMessagePanel;
function mergeSettings(...args) {
    return args.reduce((p, c) => {
        return Object.assign(p, c);
    }, {});
}
exports.mergeSettings = mergeSettings;
function showExportReport(report) {
    return __awaiter(this, void 0, void 0, function* () {
        let msg = `${report.files.length} file(s) exported in ${report.duration / 1000} seconds`;
        let viewReport = "View Report";
        let btn = yield vscode.window.showInformationMessage(msg, viewReport);
        if (btn !== viewReport)
            return;
        let rpt = `${msg}:\n\n` + report.files.join('\n');
        showMessagePanel(rpt);
    });
}
exports.showExportReport = showExportReport;
/**
 * Calculate the Monospace Length of a string, takes CJK character as length of 2
 * @param text text to calculate
 */
function MonoSpaceLength(text) {
    // https://zhuanlan.zhihu.com/p/33335629
    const CJKVReg = /[\u3006\u3007\u3021-\u3029\u3038-\u303A\u3400-\u4DB5\u4E00-\u9FEA\uF900-\uFA6D\uFA70-\uFAD9\u{17000}-\u{187EC}\u{18800}-\u{18AF2}\u{1B170}-\u{1B2FB}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}]+/ug;
    return text.length * 2 - text.replace(CJKVReg, '').length;
}
exports.MonoSpaceLength = MonoSpaceLength;
//# sourceMappingURL=tools.js.map