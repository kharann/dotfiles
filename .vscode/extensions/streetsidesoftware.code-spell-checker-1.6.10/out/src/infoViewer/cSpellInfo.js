"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cSpell:words rxjs cspell diags
const perf_1 = require("../util/perf");
perf_1.performance.mark('cSpellInfo.ts');
const vscode = require("vscode");
const path = require("path");
const preview = require("./pugCSpellInfo");
const commands = require("../commands");
const util = require("../util");
const util_1 = require("../util");
const util_2 = require("../util");
const serverSettings = require("../server");
const langCode = require("../iso639-1");
const config = require("../settings");
const Kefir = require("kefir");
const schemeCSpellInfo = 'cspell-info';
exports.commandDisplayCSpellInfo = 'cSpell.displayCSpellInfo';
exports.commandEnableLanguage = 'cSpell.enableLanguageFromCSpellInfo';
exports.commandDisableLanguage = 'cSpell.disableLanguageFromCSpellInfo';
exports.commandSetLocal = 'cSpell.setLocal';
exports.commandOverrideLocalSetting = 'cSpell.overrideLocalSetting';
exports.commandSelectInfoTab = 'cSpell.selectInfoTab';
function genCommandLink(command, paramValues) {
    const cmd = `command:${command}?`;
    const params = paramValues ? JSON.stringify(paramValues) : '';
    return encodeURI(cmd + params);
}
function generateEnableDisableLanguageLink(enable, languageId) {
    const links = [
        exports.commandDisableLanguage,
        exports.commandEnableLanguage,
    ];
    return genCommandLink(links[enable ? 1 : 0], [languageId]);
}
function activate(context, client) {
    let refreshEmitter;
    const previewUri = vscode.Uri.parse(`${schemeCSpellInfo}://authority/cspell-info-preview`);
    function onRefresh(uri) {
        refreshEmitter && refreshEmitter.emit(uri);
    }
    let lastDocumentUri = undefined;
    let activeTab = 'LocalInfo';
    const imagesUri = vscode.Uri.file(context.asAbsolutePath('images'));
    const imagesPath = imagesUri.path;
    let knownLocals = new Map();
    class CSpellInfoTextDocumentContentProvider {
        constructor() {
            this._onDidChange = new vscode.EventEmitter();
        }
        provideTextDocumentContent(_) {
            // console.log(_);
            const editor = vscode.window.activeTextEditor;
            const doc = lastDocumentUri && findMatchingDocument(lastDocumentUri.toString())
                || (editor && editor.document);
            return this.createInfoHtml(doc);
        }
        get onDidChange() {
            return this._onDidChange.event;
        }
        update(uri) {
            this._onDidChange.fire(uri);
        }
        createInfoHtml(document) {
            if (!document) {
                return Promise.resolve('<body>Select an editor tab.</body>');
            }
            const uri = document.uri;
            const filename = path.basename(uri.path);
            const fileURI = uri.toString();
            const diagnostics = client.diagnostics;
            const diags = diagnostics && diagnostics.get(uri);
            const allSpellingErrors = (diags || [])
                .map(d => d.range)
                .map(range => document.getText(range));
            const spellingErrors = diags && util.freqCount(allSpellingErrors);
            autoRefresh(uri); // Since the diags can change, we need to setup a refresh.
            return client.getConfigurationForDocument(document).then(response => {
                const { fileEnabled = false, languageEnabled = false, settings = {}, docSettings = {} } = response;
                const languageId = document.languageId;
                const dictionaries = settings.dictionaryDefinitions || [];
                const local = getLocalSetting();
                const availableLocals = friendlyLocals(serverSettings.extractLocals(settings));
                const localInfo = composeLocalInfo(settings);
                const dictionariesForFile = [...(docSettings.dictionaries || [])].sort();
                const dictionariesInUse = new Set(dictionariesForFile);
                const isDictionaryInUse = (dict) => dictionariesInUse.has(dict);
                const useDarkTheme = isDarkTheme();
                const html = preview.render({
                    useDarkTheme,
                    fileEnabled,
                    languageEnabled,
                    languageId,
                    filename,
                    fileURI,
                    spellingErrors,
                    linkEnableDisableLanguage: generateEnableDisableLanguageLink(!languageEnabled, languageId),
                    linkEnableLanguage: generateEnableDisableLanguageLink(true, languageId),
                    linkDisableLanguage: generateEnableDisableLanguageLink(false, languageId),
                    imagesPath,
                    localInfo,
                    local,
                    availableLocals,
                    genSetLocal,
                    genSelectInfoTabLink,
                    genOverrideLocal,
                    genCommandLink,
                    dictionariesForFile,
                    isDictionaryInUse,
                    dictionaries,
                    activeTab,
                });
                return html;
            });
        }
    }
    const provider = new CSpellInfoTextDocumentContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(schemeCSpellInfo, provider);
    const subOnDidChangeTextDocument = Kefir.stream((emitter) => {
        refreshEmitter = emitter;
        return () => { refreshEmitter = undefined; };
    })
        .filter(uri => util_2.isSupportedUri(uri))
        // .tap(uri => console.log('subOnDidChangeTextDocument: ' + uri.toString())),
        .map(uri => lastDocumentUri = uri)
        .debounce(250)
        .observe(() => provider.update(previewUri));
    const subOnDidChangeDoc = vscode.workspace.onDidChangeTextDocument((e) => {
        if (vscode.window.activeTextEditor && e.document && e.document === vscode.window.activeTextEditor.document) {
            onRefresh(e.document.uri);
        }
    });
    const subOnDidChangeEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor === vscode.window.activeTextEditor && editor.document) {
            onRefresh(editor.document.uri);
        }
    });
    const subOnDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('cSpell')) {
            onRefresh(lastDocumentUri);
        }
    });
    function displayCSpellInfo() {
        return vscode.commands
            .executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Spell Checker Info')
            .then((success) => { }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    }
    function findDocumentInVisibleTextEditors(uri) {
        const docs = vscode.window.visibleTextEditors
            .map(e => e.document)
            .filter(doc => !!doc)
            .filter(doc => doc.uri.toString() === uri);
        return docs[0];
    }
    function findMatchingDocument(uri) {
        const workspace = vscode.workspace || {};
        const docs = (workspace.textDocuments || [])
            .filter(doc => doc.uri.toString() === uri);
        return docs[0] || findDocumentInVisibleTextEditors(uri);
    }
    function enableLanguage(languageId, uri) {
        commands.enableLanguageId(languageId, uri);
    }
    function disableLanguage(languageId, uri) {
        commands.disableLanguageId(languageId, uri);
    }
    function setLocal(local, enable, isGlobalOrTarget) {
        const target = toTarget(isGlobalOrTarget);
        if (enable) {
            config.enableLocal(target, local);
        }
        else {
            config.disableLocal(target, local);
        }
    }
    function overrideLocalSetting(enable, isGlobalOrTarget) {
        config.overrideLocal(enable, toTarget(isGlobalOrTarget));
    }
    function genSetLocal(code, enable, isGlobalOrTarget) {
        return genCommandLink(exports.commandSetLocal, [code, enable, isGlobalOrTarget]);
    }
    function genOverrideLocal(enable, isGlobalOrTarget) {
        return genCommandLink(exports.commandOverrideLocalSetting, [enable, isGlobalOrTarget]);
    }
    function selectInfoTab(tab) {
        activeTab = tab;
    }
    function genSelectInfoTabLink(tab) {
        return genCommandLink(exports.commandSelectInfoTab, [tab]);
    }
    function makeDisposable(sub) {
        return {
            dispose: () => sub.unsubscribe()
        };
    }
    function autoRefresh(uri) {
        lastDocumentUri = uri;
        setTimeout(() => {
            if (uri === lastDocumentUri) {
                onRefresh(uri);
            }
        }, 1000);
    }
    function friendlyLocals(locals = []) {
        return locals
            .filter(a => !!a.trim())
            .map(code => langCode.lookupCode(code) || { lang: code, country: '' })
            .map(({ lang, country }) => country ? `${lang} - ${country}` : lang)
            .map(lang => lang.trim())
            .filter(util_1.uniqueFilter())
            .sort();
    }
    function localInfo(locals = [], defaults = {}) {
        return locals
            .filter(a => !!a.trim())
            .filter(util_1.uniqueFilter())
            .sort()
            .map(code => ({ code }))
            .map(info => {
            const { lang, country } = langCode.lookupCode(info.code) || { lang: info.code, country: '' };
            const name = country ? `${lang} - ${country}` : lang;
            return Object.assign({ dictionaries: [] }, defaults, info, { name });
        });
    }
    function getLocalSetting() {
        const langSettings = getLanguageSettingFromVSCode();
        return {
            default: langSettings.defaultValue,
            user: langSettings.globalValue,
            workspace: langSettings.workspaceValue,
            folder: langSettings.workspaceFolderValue,
        };
    }
    function getLanguageSettingFromVSCode() {
        return config.inspectSettingFromVSConfig('language', determineDocUri() || null) || { key: '' };
    }
    function composeLocalInfo(settingsFromServer) {
        const dictByLocal = serverSettings.extractDictionariesByLocal(settingsFromServer);
        const availableLocals = localInfo(serverSettings.extractLocals(settingsFromServer));
        const localsFromServer = localInfo(serverSettings.extractLanguage(settingsFromServer), { enabled: true });
        const fromConfig = getLanguageSettingFromVSCode();
        const globalLocals = localInfo(serverSettings.normalizeToLocals(fromConfig.globalValue), { isInUserSettings: true });
        const workspaceLocals = localInfo(serverSettings.normalizeToLocals(fromConfig.workspaceValue), { isInWorkspaceSettings: true });
        const folderLocals = localInfo(serverSettings.normalizeToLocals(fromConfig.workspaceFolderValue), { isInFolderSettings: true });
        function resetKnownLocals() {
            [...knownLocals.values()]
                .forEach(info => {
                delete info.enabled;
                delete info.isInUserSettings;
                delete info.isInWorkspaceSettings;
                delete info.isInFolderSettings;
            });
        }
        resetKnownLocals();
        // Add all the available locals
        availableLocals.concat(localsFromServer, globalLocals, workspaceLocals, folderLocals)
            .forEach(info => knownLocals.set(info.code, Object.assign({}, knownLocals.get(info.code), info)));
        if (workspaceLocals.length) {
            // Force values to false.
            [...knownLocals.values()].forEach(info => info.isInWorkspaceSettings = info.isInWorkspaceSettings || false);
        }
        if (folderLocals.length) {
            // Force values to false.
            [...knownLocals.values()].forEach(info => info.isInFolderSettings = info.isInFolderSettings || false);
        }
        const locals = [...knownLocals.values()].sort((a, b) => a.name.localeCompare(b.name));
        return augmentLocals(locals, dictByLocal);
    }
    function augmentLocals(locals, dictByLocal) {
        locals.forEach(local => {
            local.dictionaries = (dictByLocal.get(local.code) || []).sort();
        });
        return locals;
    }
    function determineDoc() {
        const editor = vscode.window.activeTextEditor;
        return lastDocumentUri && findMatchingDocument(lastDocumentUri.toString())
            || (editor && editor.document);
    }
    function determineDocUri() {
        const doc = determineDoc();
        return doc && doc.uri;
    }
    function toTarget(target) {
        if (typeof target === 'boolean') {
            return target ? config.Target.Global : config.Target.Workspace;
        }
        const uri = determineDocUri();
        switch (target.toLowerCase()) {
            case 'folder':
                return uri
                    ? {
                        target: config.Target.WorkspaceFolder,
                        uri,
                    }
                    : config.Target.Workspace;
            case 'workspace':
                return config.Target.Workspace;
            case 'global':
            default:
                return config.Target.Global;
        }
    }
    context.subscriptions.push(subOnDidChangeEditor, subOnDidChangeDoc, subOnDidChangeConfiguration, vscode.commands.registerCommand(exports.commandDisplayCSpellInfo, displayCSpellInfo), vscode.commands.registerCommand(exports.commandEnableLanguage, enableLanguage), vscode.commands.registerCommand(exports.commandDisableLanguage, disableLanguage), vscode.commands.registerCommand(exports.commandSetLocal, setLocal), vscode.commands.registerCommand(exports.commandOverrideLocalSetting, overrideLocalSetting), vscode.commands.registerCommand(exports.commandSelectInfoTab, selectInfoTab), registration, makeDisposable(subOnDidChangeTextDocument));
}
exports.activate = activate;
function isDarkTheme() {
    const config = vscode.workspace.getConfiguration();
    const theme = (config.get('workbench.colorTheme') || '').toString();
    return (/dark|black|midnight|graphite/i).test(theme);
}
perf_1.performance.mark('cSpellInfo.ts Done');
//# sourceMappingURL=cSpellInfo.js.map