"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const extension_1 = require("../extension");
function calculateExportPath(source, format) {
    let outDirName = ""; //config.exportOutDirName
    let dir = "";
    let wkdir = vscode.workspace.rootPath;
    //if current document is in workspace, organize exports in 'out' directory.
    //if not, export beside the document.
    if (wkdir && isSubPath(source, wkdir))
        dir = path.join(wkdir, outDirName);
    let exportDir = path.dirname(source);
    if (!path.isAbsolute(exportDir))
        return "";
    if (dir && wkdir) {
        let temp = path.relative(wkdir, exportDir);
        exportDir = path.join(dir, temp);
    }
    return path.join(exportDir, path.basename(source, ".md") + `.${format.toLowerCase()}`);
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
//# sourceMappingURL=tools.js.map