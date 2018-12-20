"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contributors_1 = require("./contributors");
const tools_1 = require("./tools");
const mdConfig_1 = require("./mdConfig");
var Contributes;
(function (Contributes) {
    let Styles;
    (function (Styles) {
        /**
         * get all contribute styles, include official and thirdParty
         * Notice: all() does not include user setting styles
         */
        function all() {
            return contributors_1.Contributors.getStyles()
                .join("\n").trim();
        }
        Styles.all = all;
        /**
         * get official contributed styles
         */
        function official() {
            return contributors_1.Contributors.getStyles(c => c.type === contributors_1.Contributors.Type.official)
                .join("\n").trim();
        }
        Styles.official = official;
        /**
         * get third party contributed styles
         */
        function thirdParty() {
            return contributors_1.Contributors.getStyles(c => c.type !== contributors_1.Contributors.Type.official)
                .join("\n").trim();
        }
        Styles.thirdParty = thirdParty;
        /**
         * get user setting styles for target document
         * @param uri uri of target document
         */
        function user(uri) {
            let conf = mdConfig_1.mdConfig.styles(uri);
            return conf.embedded.concat(conf.linked)
                .join("\n").trim();
        }
        Styles.user = user;
    })(Styles = Contributes.Styles || (Contributes.Styles = {}));
    let Scripts;
    (function (Scripts) {
        /**
         * get all contribute scripts, include official and thirdParty
         */
        function all() {
            return contributors_1.Contributors.getScripts()
                .join("\n").trim();
        }
        Scripts.all = all;
        /**
         * get official contributed scripts
         */
        function official() {
            return contributors_1.Contributors.getScripts(c => c.type === contributors_1.Contributors.Type.official)
                .join("\n").trim();
        }
        Scripts.official = official;
        /**
         * get third party contributed scripts
         */
        function thirdParty() {
            return contributors_1.Contributors.getScripts(c => c.type !== contributors_1.Contributors.Type.official)
                .join("\n").trim();
        }
        Scripts.thirdParty = thirdParty;
    })(Scripts = Contributes.Scripts || (Contributes.Scripts = {}));
    /**
     * create contribute style item by given content
     * @param content css styles content to create
     * @param comment comment to put beside the contribute item
     */
    function createStyle(content, comment) {
        return tools_1.createContributeItem(content, true, comment);
    }
    Contributes.createStyle = createStyle;
    /**
     * create contribute script item by given content
     * @param content javascript content to create
     * @param comment comment to put beside the contribute item
     */
    function createScript(content, comment) {
        return tools_1.createContributeItem(content, true, comment);
    }
    Contributes.createScript = createScript;
})(Contributes = exports.Contributes || (exports.Contributes = {}));
//# sourceMappingURL=contributes.js.map