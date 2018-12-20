"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageclient_1 = require("vscode-languageclient");
const vscode = require("vscode");
const Settings = require("../settings");
const LanguageIds = require("../settings/languageIds");
const util_1 = require("../util");
// The debug options for the server
const debugOptions = { execArgv: ['--nolazy', '--inspect=60048'] };
const methodNames = {
    isSpellCheckEnabled: 'isSpellCheckEnabled',
    getConfigurationForDocument: 'getConfigurationForDocument',
    splitTextIntoWords: 'splitTextIntoWords',
};
class CSpellClient {
    /**
     * @param: {string} module -- absolute path to the server module.
     */
    constructor(module, languageIds) {
        this.import = new Set();
        const enabledLanguageIds = Settings.getScopedSettingFromVSConfig('enabledLanguageIds', Settings.Scopes.Workspace);
        const allowedSchemas = Settings.getScopedSettingFromVSConfig('allowedSchemas', Settings.Scopes.Workspace) || util_1.supportedSchemes;
        util_1.setOfSupportedSchemes.clear();
        allowedSchemas.forEach(schema => util_1.setOfSupportedSchemes.add(schema));
        const uniqueLangIds = languageIds
            .concat(enabledLanguageIds || [])
            .concat(LanguageIds.languageIds)
            .filter(util_1.uniqueFilter());
        const documentSelector = allowedSchemas
            .map(schema => uniqueLangIds.map(language => ({ language, schema })))
            .reduce((a, b) => a.concat(b));
        // Options to control the language client
        const clientOptions = {
            documentSelector,
            diagnosticCollectionName: 'cSpell Checker',
            synchronize: {
                // Synchronize the setting section 'spellChecker' to the server
                configurationSection: ['cSpell', 'search']
            }
        };
        // If the extension is launched in debug mode the debug server options are use
        // Otherwise the run options are used
        const serverOptions = {
            run: { module, transport: vscode_languageclient_1.TransportKind.ipc },
            debug: { module, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
        };
        // Create the language client and start the client.
        this.client = new vscode_languageclient_1.LanguageClient('cspell', 'Code Spell Checker', serverOptions, clientOptions);
        this.client.registerProposedFeatures();
    }
    needsStart() {
        return this.client.needsStart();
    }
    needsStop() {
        return this.client.needsStop();
    }
    start() {
        return this.client.start();
    }
    isSpellCheckEnabled(document) {
        const { uri, languageId = '' } = document;
        if (!uri || !languageId) {
            return Promise.resolve({});
        }
        return this.client.onReady().then(() => this.sendRequest(methodNames.isSpellCheckEnabled, { uri: uri.toString(), languageId }))
            .then((response) => response);
    }
    getConfigurationForDocument(document) {
        const { uri, languageId = '' } = document;
        if (!uri || !languageId) {
            return Promise.resolve({});
        }
        return this.client.onReady().then(() => this.sendRequest(methodNames.getConfigurationForDocument, { uri: uri.toString(), languageId }));
    }
    splitTextIntoDictionaryWords(text) {
        return this.client.onReady().then(() => this.sendRequest(methodNames.splitTextIntoWords, text));
    }
    notifySettingsChanged() {
        return this.client.onReady().then(() => this.sendNotification('onConfigChange'));
    }
    registerConfiguration(path) {
        return this.client.onReady().then(() => this.sendNotification('registerConfigurationFile', path));
    }
    get diagnostics() {
        return (this.client && this.client.diagnostics) || undefined;
    }
    triggerSettingsRefresh() {
        return this.notifySettingsChanged();
    }
    sendRequest(method, param) {
        return this.client.sendRequest(method, param);
    }
    sendNotification(method, params) {
        this.client.sendNotification(method, params);
    }
    static create(module) {
        return vscode.languages.getLanguages().then(langIds => new CSpellClient(module, langIds));
    }
}
exports.CSpellClient = CSpellClient;
//# sourceMappingURL=client.js.map