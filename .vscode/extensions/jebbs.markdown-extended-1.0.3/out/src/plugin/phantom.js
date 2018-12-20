"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const extension_1 = require("../extension");
const fs = require("fs");
function phantomInstalled() {
    let platform = process.env.PHANTOMJS_PLATFORM || process.platform;
    let pkgPath = path.join(extension_1.context.extensionPath, 'node_modules', 'phantomjs-prebuilt', 'lib', 'phantom').replace(/\\/g, '/');
    let location = platform === 'win32' ?
        path.join(pkgPath, 'bin', 'phantomjs.exe') :
        path.join(pkgPath, 'bin', 'phantomjs');
    return fs.existsSync(location);
}
exports.phantomInstalled = phantomInstalled;
function installPhantom() {
    var install = path.join(extension_1.context.extensionPath, 'node_modules', 'phantomjs-prebuilt', 'install.js').replace(/\\/g, '/');
    try {
        if (fs.existsSync(install)) {
            require(install);
        }
    }
    catch (e) {
        console.error(e.message);
    }
}
exports.installPhantom = installPhantom;
//# sourceMappingURL=phantom.js.map