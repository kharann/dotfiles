"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configReader_1 = require("./configReader");
const path = require("path");
const tools_1 = require("../contributes/tools");
class MDConfig extends configReader_1.ConfigReader {
    constructor() {
        super('markdown');
    }
    onChange() { }
    styles(uri) {
        const ISURL = /^http.+/i;
        let styles = {
            embedded: [],
            linked: [],
        };
        let stylePathes = this.read('styles', uri, (root, value) => {
            return value.map(v => {
                if (ISURL.test(v))
                    return v;
                return path.join(root.fsPath, v);
            });
        });
        if (!stylePathes || !stylePathes.length)
            return styles;
        stylePathes.map(stl => {
            let style = "";
            if (ISURL.test(stl)) {
                styles.linked.push(`<link rel="stylesheet" href="${stl}">`);
            }
            else {
                let result = tools_1.readContributeFile(stl, true);
                if (result)
                    styles.embedded.push(result);
            }
        });
        return styles;
    }
}
exports.mdConfig = new MDConfig();
//# sourceMappingURL=mdConfig.js.map