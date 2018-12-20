"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const tools_1 = require("./tools");
var Contributors;
(function (Contributors) {
    let Type;
    (function (Type) {
        Type[Type["unknown"] = 0] = "unknown";
        Type[Type["official"] = 1] = "official";
        Type[Type["thirdParty"] = 2] = "thirdParty";
    })(Type = Contributors.Type || (Contributors.Type = {}));
    const all = vscode.extensions.all
        .map(e => getContributor(e))
        .filter(c => c && (c.styles.length + c.scripts.length));
    function getStyles(filter) {
        return getFiles(all, filter, true).map(file => tools_1.readContributeFile(file, true));
    }
    Contributors.getStyles = getStyles;
    function getScripts(filter) {
        return getFiles(all, filter, false).map(file => tools_1.readContributeFile(file, false));
    }
    Contributors.getScripts = getScripts;
    function getContributor(ext) {
        if (!ext || !ext.packageJSON || !ext.packageJSON.contributes)
            return undefined;
        return {
            extension: ext,
            type: getContributorType(ext),
            styles: getContributeFiles(ext, "markdown.previewStyles"),
            scripts: getContributeFiles(ext, "markdown.previewScripts"),
        };
    }
    function getContributeFiles(ext, name) {
        let results = [];
        let files = ext.packageJSON.contributes[name];
        if (files && files.length) {
            files.forEach(file => {
                if (!path.isAbsolute(file))
                    file = path.join(ext.extensionPath, file);
                if (!fs.existsSync(file))
                    return;
                results.push(file);
            });
        }
        return results;
    }
    function getContributorType(ext) {
        if (!ext || !ext.packageJSON || !ext.packageJSON.publisher)
            return Type.unknown;
        if (ext.packageJSON.publisher) {
            if (ext.packageJSON.publisher == "vscode") {
                return Type.official;
            }
            else {
                return Type.thirdParty;
            }
        }
        else {
            return Type.unknown;
        }
    }
    function getFiles(contributors, filter, isStyle) {
        let files = [];
        if (!filter)
            filter = () => true;
        contributors.filter(c => filter(c))
            .forEach(c => files.push(...(isStyle ? c.styles : c.scripts)));
        return files;
    }
})(Contributors = exports.Contributors || (exports.Contributors = {}));
//# sourceMappingURL=contributors.js.map