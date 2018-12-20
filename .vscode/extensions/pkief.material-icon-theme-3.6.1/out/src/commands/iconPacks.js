"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const index_1 = require("../models/index");
const helpers = require("./../helpers");
const i18n = require("./../i18n");
/** Command to toggle the icons packs */
exports.toggleIconPacks = () => {
    return getActiveIconPack()
        .then((pack) => showQuickPickItems(pack)
        .then((value) => handleQuickPickActions(value)));
};
/** Get all packs that can be used in this icon theme. */
exports.getAllIconPacks = () => {
    const packs = [];
    for (let item in index_1.IconPack) {
        if (isNaN(Number(item))) {
            packs.push(index_1.IconPack[item].toLowerCase());
        }
    }
    return packs;
};
/** Show QuickPick items to select preferred configuration for the icon packs. */
const showQuickPickItems = (activePack) => {
    const packs = [...exports.getAllIconPacks().sort(), 'none'];
    const options = packs.map((pack) => {
        const packLabel = helpers.toTitleCase(pack.replace('_', ' + '));
        const active = isPackActive(activePack, pack);
        const iconPacksDeactivated = pack === 'none' && activePack === '';
        return {
            description: packLabel,
            detail: i18n.translate(`iconPacks.${pack === 'none' ? 'disabled' : 'description'}`, packLabel),
            label: iconPacksDeactivated ? '\u2714' : active ? '\u2714' : '\u25FB'
        };
    });
    return vscode.window.showQuickPick(options, {
        placeHolder: i18n.translate('iconPacks.selectPack'),
        ignoreFocusOut: false,
        matchOnDescription: true,
        matchOnDetail: true
    });
};
/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value) => {
    if (!value || !value.description)
        return;
    const decision = value.description.replace(' + ', '_').toLowerCase();
    helpers.setThemeConfig('activeIconPack', decision === 'none' ? '' : decision, true);
};
const getActiveIconPack = () => {
    return helpers.getMaterialIconsJSON().then((config) => config.options.activeIconPack);
};
const isPackActive = (activePack, pack) => {
    return activePack.toLowerCase() === pack.toLowerCase();
};
//# sourceMappingURL=iconPacks.js.map