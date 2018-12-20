"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const contributes_1 = require("./contributes");
var MDContributes;
(function (MDContributes) {
    function officialStyles() {
        // console.log("contributors:", contributors.length);
        return getFiles(contributes_1.contributors, c => (c.type === contributes_1.ContributorType.official), true).map(file => readFile(file, true)).join("\n").trim();
    }
    MDContributes.officialStyles = officialStyles;
    function thirdPartyStyles() {
        return getFiles(contributes_1.contributors, c => (c.catagory === contributes_1.ContributorCatagory.theme), true).map(file => readFile(file, true)).join("\n").trim();
    }
    MDContributes.thirdPartyStyles = thirdPartyStyles;
    function featureStyles() {
        return getFiles(contributes_1.contributors, c => (c.catagory === contributes_1.ContributorCatagory.feature), true).map(file => readFile(file, true)).join("\n").trim();
    }
    MDContributes.featureStyles = featureStyles;
    function scripts() {
        return getFiles(contributes_1.contributors, () => true, false).map(file => readFile(file, false)).join("\n").trim();
    }
    MDContributes.scripts = scripts;
    function getFiles(contributors, callbackFn, isStyle) {
        let files = [];
        contributors.filter(c => callbackFn(c))
            .forEach(c => files.push(...(isStyle ? c.styles : c.scripts)));
        return files;
    }
    function readFile(file, isStyle) {
        let b64 = fs.readFileSync(file).toString("base64");
        let comment = `<!-- ${path.basename(file)} -->\n`;
        if (isStyle) {
            return comment + `<link rel="stylesheet" type="text/css" href="data:text/css;base64,${b64}"/>`;
        }
        else {
            return comment + `<script type="text/javascript" src="data:text/javascript;base64,${b64}"></script>`;
        }
    }
})(MDContributes = exports.MDContributes || (exports.MDContributes = {}));
//# sourceMappingURL=styles.js.map