"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("./vscode.workspaceFolders");
const path = require("path");
const fs = require("fs-extra");
const CSpell = require("cspell");
const vscode_uri_1 = require("vscode-uri");
const util_1 = require("./util");
const defaultExclude = [
    'debug:*',
    'debug:/**',
    'vscode:/**',
    'private:/**',
    'markdown:/**',
    'git-index:/**',
    '**/*.rendered',
    '**/*.*.rendered',
    '__pycache__/**',
];
const defaultAllowedSchemas = ['file', 'untitled'];
const schemaBlackList = ['git', 'output', 'debug', 'vscode'];
class DocumentSettings {
    constructor(connection, defaultSettings) {
        this.connection = connection;
        this.defaultSettings = defaultSettings;
        this.settingsByDoc = new Map();
        this.configsToImport = new Set();
        this._version = 0;
    }
    async getSettings(document) {
        return this.getUriSettings(document.uri);
    }
    async getUriSettings(uri) {
        const key = uri || '';
        const s = this.settingsByDoc.get(key);
        if (s) {
            return s;
        }
        util_1.log('getUriSettings:', uri);
        const r = uri
            ? await this.fetchUriSettings(uri)
            : CSpell.mergeSettings(this.defaultSettings, this.importSettings);
        this.settingsByDoc.set(key, r);
        return r;
    }
    async isExcluded(uri) {
        const settingsByWorkspaceFolder = await this.findMatchingFolderSettings(uri);
        const fnExclTests = settingsByWorkspaceFolder.map(s => s.fnFileExclusionTest);
        for (const fn of fnExclTests) {
            if (fn(uri)) {
                return true;
            }
        }
        return false;
    }
    resetSettings() {
        util_1.log(`resetSettings`);
        this._settingsByWorkspaceFolder = undefined;
        this.settingsByDoc.clear();
        this._folders = undefined;
        this._importSettings = undefined;
        this._version += 1;
    }
    get folders() {
        if (!this._folders) {
            this._folders = this.fetchFolders();
        }
        return this._folders;
    }
    get settingsByWorkspaceFolder() {
        if (!this._settingsByWorkspaceFolder) {
            this._settingsByWorkspaceFolder = this.fetchFolderSettings();
        }
        return this._settingsByWorkspaceFolder;
    }
    get importSettings() {
        if (!this._importSettings) {
            util_1.log(`importSettings`);
            const importPaths = [...configsToImport.keys()].sort();
            this._importSettings = CSpell.readSettingsFiles(importPaths);
        }
        return this._importSettings;
    }
    get version() {
        return this._version;
    }
    registerConfigurationFile(path) {
        util_1.log('registerConfigurationFile:', path);
        configsToImport.add(path);
        this._importSettings = undefined;
    }
    async fetchUriSettings(uri) {
        util_1.log('Start fetchUriSettings:', uri);
        const folderSettings = (await this.findMatchingFolderSettings(uri)).map(s => s.settings);
        // Only use file Settings if we do not have any folder Settings.
        const fileSettings = folderSettings.length ? {} : (await this.fetchSettingsForUri(uri, {})).settings;
        const spellSettings = CSpell.mergeSettings(this.defaultSettings, this.importSettings, ...folderSettings, fileSettings);
        util_1.log('Finish fetchUriSettings:', uri);
        return spellSettings;
    }
    async findMatchingFolderSettings(docUri) {
        const settingsByFolder = await this.settingsByWorkspaceFolder;
        return [...settingsByFolder.values()]
            .filter(({ uri }) => uri === docUri.slice(0, uri.length))
            .sort((a, b) => a.uri.length - b.uri.length)
            .reverse();
    }
    async fetchFolders() {
        return await vscode.getWorkspaceFolders(this.connection) || [];
    }
    async fetchFolderSettings() {
        util_1.log('fetchFolderSettings');
        const folders = await this.fetchFolders();
        const workplaceSettings = readAllWorkspaceFolderSettings(folders);
        const extSettings = workplaceSettings.map(async ([uri, settings]) => this.fetchSettingsForUri(uri, settings));
        return new Map((await Promise.all(extSettings)).map(s => [s.uri, s]));
    }
    async fetchSettingsForUri(uri, settings) {
        const configs = await vscode.getConfiguration(this.connection, [
            { scopeUri: uri, section: 'cSpell' },
            { section: 'search' }
        ]);
        const [cSpell, search] = configs;
        const { exclude = {} } = search;
        const cSpellConfigSettings = Object.assign({ id: 'VSCode-Config' }, cSpell);
        const mergedSettings = CSpell.mergeSettings(settings, cSpellConfigSettings);
        const { ignorePaths = [] } = mergedSettings;
        const { allowedSchemas = defaultAllowedSchemas } = cSpell;
        const allowedSchemasSet = new Set(allowedSchemas);
        const globs = defaultExclude.concat(ignorePaths, CSpell.ExclusionHelper.extractGlobsFromExcludeFilesGlobMap(exclude));
        util_1.log(`fetchFolderSettings: URI ${uri}`);
        const root = uri;
        const fnFileExclusionTest = CSpell.ExclusionHelper.generateExclusionFunctionForUri(globs, root, allowedSchemasSet);
        const ext = {
            uri,
            vscodeSettings: { cSpell },
            settings: mergedSettings,
            fnFileExclusionTest,
        };
        return ext;
    }
}
exports.DocumentSettings = DocumentSettings;
const configsToImport = new Set();
function configPathsForRoot(workspaceRootUri) {
    const workspaceRoot = workspaceRootUri ? vscode_uri_1.default.parse(workspaceRootUri).fsPath : '';
    const paths = workspaceRoot ? [
        path.join(workspaceRoot, '.vscode', CSpell.defaultSettingsFilename.toLowerCase()),
        path.join(workspaceRoot, '.vscode', CSpell.defaultSettingsFilename),
        path.join(workspaceRoot, CSpell.defaultSettingsFilename.toLowerCase()),
        path.join(workspaceRoot, CSpell.defaultSettingsFilename),
    ] : [];
    return paths;
}
function readAllWorkspaceFolderSettings(workspaceFolders) {
    CSpell.clearCachedSettings();
    return workspaceFolders
        .map(folder => folder.uri)
        .filter(uri => util_1.log(`readAllWorkspaceFolderSettings URI ${uri}`) || true)
        .map(uri => [uri, configPathsForRoot(uri)])
        .map(([uri, paths]) => [uri, readSettingsFiles(paths)]);
}
function readSettingsFiles(paths) {
    util_1.log(`readSettingsFiles:`, paths);
    const existingPaths = paths.filter(filename => fs.existsSync(filename));
    return CSpell.readSettingsFiles(existingPaths);
}
function isUriAllowed(uri, schemas) {
    schemas = schemas || defaultAllowedSchemas;
    return doesUriMatchAnySchema(uri, schemas);
}
exports.isUriAllowed = isUriAllowed;
function isUriBlackListed(uri, schemas = schemaBlackList) {
    return doesUriMatchAnySchema(uri, schemas);
}
exports.isUriBlackListed = isUriBlackListed;
function doesUriMatchAnySchema(uri, schemas) {
    const schema = uri.split(':')[0];
    return schemas.findIndex(v => v === schema) >= 0;
}
exports.doesUriMatchAnySchema = doesUriMatchAnySchema;
//# sourceMappingURL=documentSettings.js.map