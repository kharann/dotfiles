"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const tools_1 = require("./tools");
const configReader_1 = require("../common/configReader");
class MDConfig extends configReader_1.ConfigReader {
    constructor() {
        super('markdown');
    }
    onChange() { }
    styles(uri) {
        const ISURL = /^\s*https?:\/\//i;
        let styles = {
            embedded: [],
            linked: [],
        };
        let stylePathes = this.read('styles', uri, (root, value) => {
            return value.map(v => {
                if (!ISURL.test(v) && !path.isAbsolute(v))
                    v = path.join(root.fsPath, v);
                return v;
            });
        });
        if (!stylePathes || !stylePathes.length)
            return styles;
        stylePathes.map(fileOrUrl => {
            if (ISURL.test(fileOrUrl)) {
                styles.linked.push(`<link rel="stylesheet" href="${fileOrUrl}">`);
            }
            else {
                let result = tools_1.readContributeFile(fileOrUrl, true);
                if (result)
                    styles.embedded.push(result);
            }
        });
        return styles;
    }
}
exports.mdConfig = new MDConfig();
//# sourceMappingURL=mdConfig.js.map