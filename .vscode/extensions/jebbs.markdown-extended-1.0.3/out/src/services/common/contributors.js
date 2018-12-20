"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
var ContributorType;
(function (ContributorType) {
    ContributorType[ContributorType["unknown"] = 0] = "unknown";
    ContributorType[ContributorType["official"] = 1] = "official";
    ContributorType[ContributorType["thirdParty"] = 2] = "thirdParty";
})(ContributorType = exports.ContributorType || (exports.ContributorType = {}));
var ContributorCatagory;
(function (ContributorCatagory) {
    ContributorCatagory[ContributorCatagory["none"] = 0] = "none";
    ContributorCatagory[ContributorCatagory["theme"] = 1] = "theme";
    ContributorCatagory[ContributorCatagory["feature"] = 2] = "feature";
})(ContributorCatagory = exports.ContributorCatagory || (exports.ContributorCatagory = {}));
var Contributors;
(function (Contributors) {
    const all = vscode.extensions.all
        .map(e => getContributor(e))
        .filter(c => c.catagory !== ContributorCatagory.none);
    function getStyles(callbackFn) {
        return getFiles(all, callbackFn, true).map(file => readContributeFile(file, true));
    }
    Contributors.getStyles = getStyles;
    function getScripts(callbackFn) {
        return getFiles(all, callbackFn, false).map(file => readContributeFile(file, false));
    }
    Contributors.getScripts = getScripts;
    function createStyle(content, comment) {
        return createContributeItem(content, true, comment);
    }
    Contributors.createStyle = createStyle;
    function createScript(content, comment) {
        return createContributeItem(content, true, comment);
    }
    Contributors.createScript = createScript;
})(Contributors = exports.Contributors || (exports.Contributors = {}));
function getContributor(ext) {
    let info = {
        extension: ext,
        type: getType(ext),
        catagory: ContributorCatagory.none,
        styles: [],
        scripts: [],
    };
    if (!ext || !ext.packageJSON || !ext.packageJSON.contributes)
        return info;
    const isThemeReg = /.vscode-(body|light|dark|high-contrast)/i;
    let files = ext.packageJSON.contributes["markdown.previewStyles"];
    if (files && files.length) {
        let isTheme = false;
        files.forEach(file => {
            file = path.join(ext.extensionPath, file);
            if (!fs.existsSync(file))
                return;
            isTheme = isTheme || isThemeReg.test(fs.readFileSync(file).toString());
            info.styles.push(file);
        });
        info.catagory = isTheme ? ContributorCatagory.theme : ContributorCatagory.feature;
    }
    else {
        info.catagory = ContributorCatagory.none;
    }
    files = ext.packageJSON.contributes["markdown.previewScripts"];
    if (files && files.length) {
        files.forEach(file => {
            file = path.join(ext.extensionPath, file);
            if (!fs.existsSync(file))
                return;
            info.scripts.push(file);
        });
        if (info.scripts.length && info.catagory === ContributorCatagory.none)
            info.catagory = ContributorCatagory.feature;
    }
    return info;
}
function getType(ext) {
    if (!ext || !ext.packageJSON || !ext.packageJSON.contributes)
        return ContributorType.unknown;
    if (ext.packageJSON.publisher) {
        if (ext.packageJSON.publisher == "vscode") {
            return ContributorType.official;
        }
        else {
            return ContributorType.thirdParty;
        }
    }
    else {
        return ContributorType.unknown;
    }
}
function getFiles(contributors, callbackFn, isStyle) {
    let files = [];
    callbackFn = callbackFn ? callbackFn : () => true;
    contributors.filter(c => callbackFn(c))
        .forEach(c => files.push(...(isStyle ? c.styles : c.scripts)));
    return files;
}
function readContributeFile(file, isStyle) {
    if (!fs.existsSync(file))
        return "";
    let buf = fs.readFileSync(file);
    if (!buf || !buf.length)
        return "";
    return createContributeItem(buf, isStyle, path.basename(file));
}
function createContributeItem(content, isStyle, comment) {
    if (!content)
        return "";
    let b64 = content instanceof Buffer ?
        content.toString("base64") :
        new Buffer(content).toString("base64");
    let cmt = comment ? `<!-- ${comment} -->\n` : "";
    if (isStyle) {
        return cmt + `<link rel="stylesheet" type="text/css" href="data:text/css;base64,${b64}"/>`;
    }
    else {
        return cmt + `<script type="text/javascript" src="data:text/javascript;base64,${b64}"/></script>`;
    }
}
//# sourceMappingURL=contributors.js.map