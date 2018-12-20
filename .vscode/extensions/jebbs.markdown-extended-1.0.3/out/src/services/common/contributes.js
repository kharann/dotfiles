"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contributors_1 = require("./contributors");
var MDContributes;
(function (MDContributes) {
    function officialStyles() {
        return contributors_1.Contributors.getStyles(c => c.type === contributors_1.ContributorType.official)
            .join("\n").trim();
    }
    MDContributes.officialStyles = officialStyles;
    function thirdPartyStyles() {
        return contributors_1.Contributors.getStyles(c => c.type === contributors_1.ContributorType.thirdParty)
            .join("\n").trim();
    }
    MDContributes.thirdPartyStyles = thirdPartyStyles;
    function featureStyles() {
        return contributors_1.Contributors.getStyles(c => c.catagory === contributors_1.ContributorCatagory.feature)
            .join("\n").trim();
    }
    MDContributes.featureStyles = featureStyles;
    function thirdPartyScripts() {
        return contributors_1.Contributors.getScripts(c => c.type === contributors_1.ContributorType.thirdParty)
            .join("\n").trim();
    }
    MDContributes.thirdPartyScripts = thirdPartyScripts;
})(MDContributes = exports.MDContributes || (exports.MDContributes = {}));
//# sourceMappingURL=contributes.js.map