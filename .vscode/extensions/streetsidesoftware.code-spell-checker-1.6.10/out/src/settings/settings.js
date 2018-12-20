"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_1 = require("../util/perf");
perf_1.performance.mark('settings.ts');
const server_1 = require("../server");
const CSpellSettings = require("./CSpellSettings");
const vscode_1 = require("vscode");
perf_1.performance.mark('settings.ts imports 1');
const path = require("path");
const vscode_2 = require("vscode");
const vscode = require("vscode");
perf_1.performance.mark('settings.ts imports 2');
const util_1 = require("../util");
const watcher = require("../util/watcher");
const config = require("./config");
perf_1.performance.mark('settings.ts imports 3');
const fs = require("fs-extra");
perf_1.performance.mark('settings.ts imports 4');
perf_1.performance.mark('settings.ts imports done');
exports.baseConfigName = CSpellSettings.defaultFileName;
exports.configFileLocations = [
    exports.baseConfigName,
    exports.baseConfigName.toLowerCase(),
    `.vscode/${exports.baseConfigName}`,
    `.vscode/${exports.baseConfigName.toLowerCase()}`,
];
exports.findConfig = `.vscode/{${exports.baseConfigName},${exports.baseConfigName.toLowerCase()}}`;
function watchSettingsFiles(callback) {
    // Every 10 seconds see if we have new files to watch.
    let busy = false;
    const intervalObj = setInterval(async () => {
        if (busy) {
            return;
        }
        busy = true;
        const settingsFiles = await findSettingsFiles();
        settingsFiles
            .map(uri => uri.fsPath)
            .filter(file => !watcher.isWatching(file))
            .forEach(file => watcher.add(file, callback));
        busy = false;
    }, 10000);
    return vscode.Disposable.from({ dispose: () => {
            watcher.dispose();
            clearInterval(intervalObj);
        } });
}
exports.watchSettingsFiles = watchSettingsFiles;
function getDefaultWorkspaceConfigLocation() {
    const { workspaceFolders } = vscode_1.workspace;
    const root = workspaceFolders
        && workspaceFolders[0]
        && workspaceFolders[0].uri.fsPath;
    return root
        ? path.join(root, '.vscode', exports.baseConfigName)
        : undefined;
}
exports.getDefaultWorkspaceConfigLocation = getDefaultWorkspaceConfigLocation;
function hasWorkspaceLocation() {
    const { workspaceFolders } = vscode_1.workspace;
    return !!(workspaceFolders && workspaceFolders[0]);
}
exports.hasWorkspaceLocation = hasWorkspaceLocation;
function findSettingsFiles(uri) {
    const { workspaceFolders } = vscode_1.workspace;
    if (!workspaceFolders || !hasWorkspaceLocation()) {
        return Promise.resolve([]);
    }
    const folders = uri
        ? [vscode_1.workspace.getWorkspaceFolder(uri)].filter(a => !!a)
        : workspaceFolders;
    const possibleLocations = folders
        .map(folder => folder.uri.fsPath)
        .map(root => exports.configFileLocations.map(rel => path.join(root, rel)))
        .reduce((a, b) => a.concat(b));
    const found = possibleLocations
        .map(filename => fs.pathExists(filename)
        .then(exists => ({ filename, exists })));
    return Promise.all(found).then(found => found
        .filter(found => found.exists)
        .map(found => found.filename)
        .map(filename => vscode_2.Uri.file(filename)));
}
exports.findSettingsFiles = findSettingsFiles;
function findExistingSettingsFileLocation(uri) {
    return findSettingsFiles(uri)
        .then(uris => uris.map(uri => uri.fsPath))
        .then(paths => paths[0]);
}
exports.findExistingSettingsFileLocation = findExistingSettingsFileLocation;
function findSettingsFileLocation() {
    return findExistingSettingsFileLocation()
        .then(path => path || getDefaultWorkspaceConfigLocation());
}
exports.findSettingsFileLocation = findSettingsFileLocation;
function loadTheSettingsFile() {
    return findSettingsFileLocation()
        .then(loadSettingsFile);
}
exports.loadTheSettingsFile = loadTheSettingsFile;
function loadSettingsFile(path) {
    return path
        ? CSpellSettings.readSettings(path).then(settings => (path ? { path, settings } : undefined))
        : Promise.resolve(undefined);
}
exports.loadSettingsFile = loadSettingsFile;
function setEnableSpellChecking(target, enabled) {
    return config.setSettingInVSConfig('enabled', enabled, target);
}
exports.setEnableSpellChecking = setEnableSpellChecking;
function getEnabledLanguagesFromConfig(scope) {
    return config.getScopedSettingFromVSConfig('enabledLanguageIds', scope) || [];
}
exports.getEnabledLanguagesFromConfig = getEnabledLanguagesFromConfig;
function enableLanguageIdInConfig(target, languageId) {
    const scope = config.configTargetToScope(target);
    const langs = util_1.unique([languageId, ...getEnabledLanguagesFromConfig(scope)]).sort();
    return config.setSettingInVSConfig('enabledLanguageIds', langs, target).then(() => langs);
}
exports.enableLanguageIdInConfig = enableLanguageIdInConfig;
function disableLanguageIdInConfig(target, languageId) {
    const scope = config.configTargetToScope(target);
    const langs = getEnabledLanguagesFromConfig(scope).filter(a => a !== languageId).sort();
    return config.setSettingInVSConfig('enabledLanguageIds', langs, target).then(() => langs);
}
exports.disableLanguageIdInConfig = disableLanguageIdInConfig;
/**
 * @description Enable a programming language
 * @param target - which level of setting to set
 * @param languageId - the language id, e.g. 'typescript'
 */
function enableLanguage(target, languageId) {
    const updateFile = config.isFolderLevelTarget(target);
    return enableLanguageIdInConfig(target, languageId).then(() => {
        if (config.isConfigTargetWithResource(target) && updateFile) {
            findExistingSettingsFileLocation(target.uri)
                .then(settingsFilename => settingsFilename && CSpellSettings.writeAddLanguageIdsToSettings(settingsFilename, [languageId], true))
                .then(() => { });
        }
    });
}
exports.enableLanguage = enableLanguage;
function disableLanguage(target, languageId) {
    const updateFile = config.isFolderLevelTarget(target);
    return disableLanguageIdInConfig(target, languageId).then(() => {
        if (config.isConfigTargetWithResource(target) && updateFile) {
            return findExistingSettingsFileLocation(target.uri)
                .then(settingsFilename => settingsFilename && CSpellSettings.removeLanguageIdsFromSettingsAndUpdate(settingsFilename, [languageId]))
                .then(() => { });
        }
    });
}
exports.disableLanguage = disableLanguage;
function addWordToSettings(target, word) {
    const useGlobal = config.isGlobalTarget(target) || !hasWorkspaceLocation();
    target = useGlobal ? config.ConfigurationTarget.Global : target;
    const section = useGlobal ? 'userWords' : 'words';
    const words = config.inspectScopedSettingFromVSConfig(section, config.configTargetToScope(target)) || [];
    return config.setSettingInVSConfig(section, util_1.unique(words.concat(word.split(' ')).sort()), target);
}
exports.addWordToSettings = addWordToSettings;
function removeWordFromSettings(target, word) {
    const useGlobal = config.isGlobalTarget(target);
    if (!useGlobal && !hasWorkspaceLocation()) {
        return Promise.resolve();
    }
    target = useGlobal ? config.ConfigurationTarget.Global : target;
    const section = useGlobal ? 'userWords' : 'words';
    const toRemove = word.split(' ');
    const words = config.inspectScopedSettingFromVSConfig(section, config.configTargetToScope(target)) || [];
    const wordsFiltered = CSpellSettings.filterOutWords(words, toRemove);
    return config.setSettingInVSConfig(section, wordsFiltered, target);
}
exports.removeWordFromSettings = removeWordFromSettings;
function toggleEnableSpellChecker(target) {
    const resource = config.isConfigTargetWithResource(target) ? target.uri : null;
    const curr = config.getSettingFromVSConfig('enabled', resource);
    return config.setSettingInVSConfig('enabled', !curr, target);
}
exports.toggleEnableSpellChecker = toggleEnableSpellChecker;
/**
 * Enables the current programming language of the active file in the editor.
 */
function enableCurrentLanguage() {
    const editor = vscode.window && vscode.window.activeTextEditor;
    if (editor && editor.document && editor.document.languageId) {
        const target = config.createTargetForDocument(vscode_1.ConfigurationTarget.WorkspaceFolder, editor.document);
        return enableLanguage(target, editor.document.languageId);
    }
    return Promise.resolve();
}
exports.enableCurrentLanguage = enableCurrentLanguage;
/**
 * Disables the current programming language of the active file in the editor.
 */
function disableCurrentLanguage() {
    const editor = vscode.window && vscode.window.activeTextEditor;
    if (editor && editor.document && editor.document.languageId) {
        const target = config.createTargetForDocument(vscode_1.ConfigurationTarget.WorkspaceFolder, editor.document);
        return disableLanguage(target, editor.document.languageId);
    }
    return Promise.resolve();
}
exports.disableCurrentLanguage = disableCurrentLanguage;
function enableLocal(target, local) {
    const scope = config.configTargetToScope(target);
    const currentLanguage = config.getScopedSettingFromVSConfig('language', scope) || '';
    const languages = currentLanguage.split(',')
        .concat(local.split(','))
        .map(a => a.trim())
        .filter(util_1.uniqueFilter())
        .join(',');
    return config.setSettingInVSConfig('language', languages, target);
}
exports.enableLocal = enableLocal;
function disableLocal(target, local) {
    const scope = config.configTargetToScope(target);
    local = server_1.normalizeLocal(local);
    const currentLanguage = config.inspectScopedSettingFromVSConfig('language', scope) || '';
    const languages = server_1.normalizeLocal(currentLanguage)
        .split(',')
        .filter(lang => lang !== local)
        .join(',') || undefined;
    return config.setSettingInVSConfig('language', languages, target);
}
exports.disableLocal = disableLocal;
function overrideLocal(enable, target) {
    const inspectLang = config.getScopedSettingFromVSConfig('language', config.configTargetToScope(target));
    const lang = (enable && inspectLang) || undefined;
    return config.setSettingInVSConfig('language', lang, target);
}
exports.overrideLocal = overrideLocal;
perf_1.performance.mark('settings.ts done');
//# sourceMappingURL=settings.js.map