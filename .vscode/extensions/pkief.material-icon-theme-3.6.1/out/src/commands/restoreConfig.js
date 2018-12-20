"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers = require("./../helpers");
/** Restore all configurations to default. */
exports.restoreDefaultConfig = () => {
    helpers.setThemeConfig('activeIconPack', undefined, true);
    helpers.setThemeConfig('folders.theme', undefined, true);
    helpers.setThemeConfig('folders.color', undefined, true);
    helpers.setThemeConfig('hidesExplorerArrows', undefined, true);
    helpers.setThemeConfig('opacity', undefined, true);
    helpers.setThemeConfig('files.associations', undefined, true);
    helpers.setThemeConfig('folders.associations', undefined, true);
    helpers.setThemeConfig('languages.associations', undefined, true);
};
//# sourceMappingURL=restoreConfig.js.map