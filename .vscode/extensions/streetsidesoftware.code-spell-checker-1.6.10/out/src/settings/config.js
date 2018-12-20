"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
var vscode_2 = require("vscode");
exports.ConfigurationTarget = vscode_2.ConfigurationTarget;
exports.Target = vscode_2.ConfigurationTarget;
const sectionCSpell = 'cSpell';
exports.GlobalTarget = vscode_1.ConfigurationTarget.Global;
exports.WorkspaceTarget = vscode_1.ConfigurationTarget.Workspace;
exports.Scopes = {
    Default: 'defaultValue',
    Global: 'globalValue',
    Workspace: 'workspaceValue',
    Folder: 'workspaceFolderValue',
};
const folderSettings = new Map();
/**
 * ScopeOrder from general to specific.
 */
const scopeOrder = [
    'defaultValue',
    'globalValue',
    'workspaceValue',
    'workspaceFolderValue',
];
const scopeToOrderIndex = new Map(scopeOrder.map((s, i) => [s, i]));
function getSectionName(subSection) {
    return [sectionCSpell, subSection].filter(a => !!a).join('.');
}
exports.getSectionName = getSectionName;
function getSettingsFromVSConfig(resource) {
    const config = getConfiguration(resource);
    return config.get(sectionCSpell, {});
}
exports.getSettingsFromVSConfig = getSettingsFromVSConfig;
function getSettingFromVSConfig(subSection, resource) {
    const config = getConfiguration(resource);
    const settings = config.get(sectionCSpell, {});
    return settings[subSection];
}
exports.getSettingFromVSConfig = getSettingFromVSConfig;
/**
 * Inspect a scoped setting. It will not merge values.
 * @param subSection the cspell section
 * @param scope the scope of the value. A resource is needed to get folder level settings.
 */
function inspectScopedSettingFromVSConfig(subSection, scope) {
    scope = normalizeScope(scope);
    const ins = inspectSettingFromVSConfig(subSection, scope.resource);
    return ins && ins[scope.scope];
}
exports.inspectScopedSettingFromVSConfig = inspectScopedSettingFromVSConfig;
/**
 * Inspect a scoped setting. It will not merge values.
 * @param subSection the cspell section
 * @param scope the scope of the value. A resource is needed to get folder level settings.
 */
function getScopedSettingFromVSConfig(subSection, scope) {
    scope = normalizeScope(scope);
    const ins = inspectSettingFromVSConfig(subSection, scope.resource);
    return findBestConfig(ins, scope.scope);
}
exports.getScopedSettingFromVSConfig = getScopedSettingFromVSConfig;
function inspectSettingFromVSConfig(subSection, resource) {
    const config = inspectConfig(resource);
    const { defaultValue = {}, globalValue = {}, workspaceValue = {}, workspaceFolderValue = {} } = config;
    return {
        key: config.key + '.' + subSection,
        defaultValue: defaultValue[subSection],
        globalValue: globalValue[subSection],
        workspaceValue: workspaceValue[subSection],
        workspaceFolderValue: workspaceFolderValue[subSection],
    };
}
exports.inspectSettingFromVSConfig = inspectSettingFromVSConfig;
function setSettingInVSConfig(subSection, value, configTarget) {
    const target = extractTarget(configTarget);
    const uri = extractTargetUri(configTarget);
    const section = getSectionName(subSection);
    const config = getConfiguration(uri);
    updateFolderSettings(configTarget, subSection, value);
    return config.update(section, value, target);
}
exports.setSettingInVSConfig = setSettingInVSConfig;
function inspectConfig(resource) {
    const config = getConfiguration(resource);
    const settings = config.inspect(sectionCSpell) || { key: '' };
    const { defaultValue = {}, globalValue = {}, workspaceValue = {}, workspaceFolderValue = {}, key } = settings;
    return {
        key,
        defaultValue,
        globalValue: Object.assign({}, globalValue, getFolderSettingsForScope(exports.Scopes.Global)),
        workspaceValue: Object.assign({}, workspaceValue, getFolderSettingsForScope(exports.Scopes.Workspace)),
        workspaceFolderValue: Object.assign({}, workspaceFolderValue, getFolderSettingsForScope({ scope: exports.Scopes.Folder, resource })),
    };
}
function toAny(value) {
    return value;
}
function isFolderLevelTarget(target) {
    return isConfigTargetWithResource(target) && target.target === vscode_1.ConfigurationTarget.WorkspaceFolder;
}
exports.isFolderLevelTarget = isFolderLevelTarget;
function isConfigTargetWithResource(target) {
    return typeof target === 'object';
}
exports.isConfigTargetWithResource = isConfigTargetWithResource;
const targetToScopeValues = [
    [vscode_1.ConfigurationTarget.Global, 'globalValue'],
    [vscode_1.ConfigurationTarget.Workspace, 'workspaceValue'],
    [vscode_1.ConfigurationTarget.WorkspaceFolder, 'workspaceFolderValue'],
];
const targetToScope = new Map(targetToScopeValues);
const targetResourceFreeToScopeValues = [
    [vscode_1.ConfigurationTarget.Global, 'globalValue'],
    [vscode_1.ConfigurationTarget.Workspace, 'workspaceValue'],
];
const targetResourceFreeToScope = new Map(targetResourceFreeToScopeValues);
function configTargetToScope(target) {
    if (isConfigTargetWithResource(target)) {
        return {
            scope: toScope(target.target),
            resource: target.uri,
        };
    }
    return targetResourceFreeToScope.get(target);
}
exports.configTargetToScope = configTargetToScope;
function toScope(target) {
    return targetToScope.get(target);
}
exports.toScope = toScope;
function isFullInspectScope(scope) {
    return typeof scope === 'object';
}
function normalizeScope(scope) {
    if (isFullInspectScope(scope)) {
        return {
            scope: scope.scope,
            resource: scope.scope === exports.Scopes.Folder ? normalizeResourceUri(scope.resource) : null,
        };
    }
    return { scope, resource: null };
}
function normalizeResourceUri(uri) {
    if (uri) {
        const folder = vscode_1.workspace.getWorkspaceFolder(uri);
        return folder && folder.uri || null;
    }
    return null;
}
function findBestConfig(config, scope) {
    for (let p = scopeToOrderIndex.get(scope); p >= 0; p -= 1) {
        const k = scopeOrder[p];
        const v = config[k];
        if (v !== undefined) {
            return v;
        }
    }
    return undefined;
}
function isGlobalTarget(target) {
    return extractTarget(target) === vscode_1.ConfigurationTarget.Global;
}
exports.isGlobalTarget = isGlobalTarget;
function createTargetForUri(target, uri) {
    return {
        target, uri
    };
}
exports.createTargetForUri = createTargetForUri;
function createTargetForDocument(target, doc) {
    return createTargetForUri(target, doc.uri);
}
exports.createTargetForDocument = createTargetForDocument;
function extractTarget(target) {
    return isConfigTargetWithResource(target)
        ? target.target
        : target;
}
exports.extractTarget = extractTarget;
function extractTargetUri(target) {
    return isConfigTargetWithResource(target)
        ? target.uri
        : null;
}
exports.extractTargetUri = extractTargetUri;
function getConfiguration(uri) {
    return fetchConfiguration(uri);
}
exports.getConfiguration = getConfiguration;
function fetchConfiguration(uri) {
    return vscode_1.workspace.getConfiguration(undefined, toAny(uri));
}
function updateFolderSettings(target, section, value) {
    const key = targetToFolderSettingsKey(target);
    const s = folderSettings.get(key) || {};
    s[section] = value;
    folderSettings.set(key, s);
}
function getFolderSettingsForScope(scope) {
    const key = scopeToFolderSettingsKey(scope);
    return folderSettings.get(key) || {};
}
function targetToFolderSettingsKey(target) {
    const scope = configTargetToScope(target);
    return scopeToFolderSettingsKey(scope);
}
function scopeToFolderSettingsKey(scope) {
    scope = normalizeScope(scope);
    const uri = normalizeResourceUri(scope.resource);
    return scope.scope + '::' + (uri && uri.path || '');
}
vscode_1.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration(sectionCSpell)) {
        folderSettings.delete(scopeToFolderSettingsKey(exports.Scopes.Global));
        folderSettings.delete(scopeToFolderSettingsKey(exports.Scopes.Workspace));
    }
    if (vscode_1.workspace.workspaceFolders) {
        vscode_1.workspace.workspaceFolders.forEach(folder => {
            if (event.affectsConfiguration(sectionCSpell, folder.uri)) {
                const key = scopeToFolderSettingsKey({ scope: exports.Scopes.Folder, resource: folder.uri });
                folderSettings.delete(key);
            }
        });
    }
});
//# sourceMappingURL=config.js.map