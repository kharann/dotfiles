"use strict";
// cSpell:ignore pycache
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode = require("vscode-languageserver");
const Validator = require("./validator");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const codeActions_1 = require("./codeActions");
const cspell_1 = require("cspell");
const CSpell = require("cspell");
const cspell_2 = require("cspell");
const documentSettings_1 = require("./documentSettings");
const util_1 = require("./util");
util_1.log('Starting Spell Checker Server');
const methodNames = {
    isSpellCheckEnabled: 'isSpellCheckEnabled',
    getConfigurationForDocument: 'getConfigurationForDocument',
    splitTextIntoWords: 'splitTextIntoWords',
};
const notifyMethodNames = {
    onConfigChange: 'onConfigChange',
    registerConfigurationFile: 'registerConfigurationFile',
};
const tds = CSpell;
const defaultCheckLimit = Validator.defaultCheckLimit;
// Turn off the spell checker by default. The setting files should have it set.
// This prevents the spell checker from running too soon.
const defaultSettings = Object.assign({}, CSpell.mergeSettings(cspell_2.getDefaultSettings(), CSpell.getGlobalSettings()), { checkLimit: defaultCheckLimit, enabled: false });
const defaultDebounce = 50;
function run() {
    // debounce buffer
    const validationRequestStream = new rxjs_1.ReplaySubject(1);
    const triggerUpdateConfig = new rxjs_1.ReplaySubject(1);
    const triggerValidateAll = new rxjs_1.ReplaySubject(1);
    const validationByDoc = new Map();
    let isValidationBusy = false;
    // Create a connection for the server. The connection uses Node's IPC as a transport
    util_1.log('Create Connection');
    const connection = vscode_languageserver_1.createConnection(vscode.ProposedFeatures.all);
    const documentSettings = new documentSettings_1.DocumentSettings(connection, defaultSettings);
    // Create a simple text document manager. The text document manager
    // supports full document sync only
    const documents = new vscode_languageserver_1.TextDocuments();
    connection.onInitialize((params, token) => {
        // Hook up the logger to the connection.
        util_1.log('onInitialize');
        util_1.setWorkspaceBase(params.rootUri ? params.rootUri : '');
        return {
            capabilities: {
                // Tell the client that the server works in FULL text document sync mode
                textDocumentSync: documents.syncKind,
                codeActionProvider: true
            }
        };
    });
    // The settings have changed. Is sent on server activation as well.
    connection.onDidChangeConfiguration(onConfigChange);
    function onConfigChange(change) {
        util_1.logInfo('Configuration Change');
        triggerUpdateConfig.next(undefined);
        updateLogLevel();
    }
    function updateActiveSettings() {
        util_1.log('updateActiveSettings');
        documentSettings.resetSettings();
        triggerValidateAll.next(undefined);
    }
    function getActiveSettings(doc) {
        return getActiveUriSettings(doc.uri);
    }
    function getActiveUriSettings(uri) {
        return documentSettings.getUriSettings(uri);
    }
    function registerConfigurationFile(path) {
        documentSettings.registerConfigurationFile(path);
        util_1.logInfo('Register Configuration File', path);
        triggerUpdateConfig.next(undefined);
    }
    // Listen for event messages from the client.
    connection.onNotification(notifyMethodNames.onConfigChange, onConfigChange);
    connection.onNotification(notifyMethodNames.registerConfigurationFile, registerConfigurationFile);
    connection.onRequest(methodNames.isSpellCheckEnabled, async (params) => {
        const { uri, languageId } = params;
        const fileEnabled = uri ? !await isUriExcluded(uri) : undefined;
        const settings = await getActiveUriSettings(uri);
        return {
            languageEnabled: languageId && uri ? await isLanguageEnabled({ uri, languageId }, settings) : undefined,
            fileEnabled,
        };
    });
    connection.onRequest(methodNames.getConfigurationForDocument, async (params) => {
        const { uri, languageId } = params;
        const doc = uri && documents.get(uri);
        const docSettings = doc && await getSettingsToUseForDocument(doc) || undefined;
        const settings = await getActiveUriSettings(uri);
        return {
            languageEnabled: languageId && doc ? await isLanguageEnabled(doc, settings) : undefined,
            fileEnabled: uri ? !await isUriExcluded(uri) : undefined,
            settings,
            docSettings,
        };
    });
    function textToWords(text) {
        const setOfWords = new Set(cspell_1.Text.extractWordsFromCode(text)
            .map(t => t.text)
            .map(t => t.toLowerCase()));
        return [...setOfWords];
    }
    connection.onRequest(methodNames.splitTextIntoWords, (text) => {
        return {
            words: textToWords(text),
        };
    });
    // validate documents
    const disposableValidate = validationRequestStream
        .pipe(operators_1.filter(doc => !validationByDoc.has(doc.uri)))
        .subscribe(doc => {
        if (!validationByDoc.has(doc.uri)) {
            const uri = doc.uri;
            if (documentSettings_1.isUriBlackListed(uri)) {
                validationByDoc.set(doc.uri, validationRequestStream.pipe(operators_1.filter(doc => uri === doc.uri), operators_1.take(1), operators_1.tap(doc => util_1.log('Ignoring:', doc.uri))).subscribe());
            }
            else {
                validationByDoc.set(doc.uri, validationRequestStream.pipe(operators_1.filter(doc => uri === doc.uri), operators_1.tap(doc => util_1.log('Request Validate:', doc.uri)), operators_1.debounceTime(50), operators_1.tap(doc => util_1.log('Request Validate 2:', doc.uri)), operators_1.flatMap(async (doc) => ({ doc, settings: await getActiveSettings(doc) })), operators_1.debounce(dsp => rxjs_1.timer(dsp.settings.spellCheckDelayMs || defaultDebounce)
                    .pipe(operators_1.filter(() => !isValidationBusy))), operators_1.flatMap(validateTextDocument)).subscribe(diag => connection.sendDiagnostics(diag)));
            }
        }
    });
    const disposableTriggerUpdateConfigStream = triggerUpdateConfig.pipe(operators_1.tap(() => util_1.log('Trigger Update Config')), operators_1.debounceTime(100)).subscribe(() => {
        updateActiveSettings();
    });
    const disposableTriggerValidateAll = triggerValidateAll
        .pipe(operators_1.debounceTime(250))
        .subscribe(() => {
        util_1.log('Validate all documents');
        documents.all().forEach(doc => validationRequestStream.next(doc));
    });
    async function shouldValidateDocument(textDocument, settings) {
        const { uri } = textDocument;
        return !!settings.enabled && isLanguageEnabled(textDocument, settings)
            && !await isUriExcluded(uri);
    }
    function isLanguageEnabled(textDocument, settings) {
        const { enabledLanguageIds = [] } = settings;
        return enabledLanguageIds.indexOf(textDocument.languageId) >= 0;
    }
    async function isUriExcluded(uri) {
        return documentSettings.isExcluded(uri);
    }
    async function getBaseSettings(doc) {
        const settings = await getActiveSettings(doc);
        return Object.assign({}, CSpell.mergeSettings(defaultSettings, settings), { enabledLanguageIds: settings.enabledLanguageIds });
    }
    async function getSettingsToUseForDocument(doc) {
        return tds.constructSettingsForText(await getBaseSettings(doc), doc.getText(), doc.languageId);
    }
    async function validateTextDocument(dsp) {
        async function validate() {
            const { doc, settings } = dsp;
            const uri = doc.uri;
            try {
                if (!documentSettings_1.isUriAllowed(uri, settings.allowedSchemas)) {
                    const schema = uri.split(':')[0];
                    util_1.log(`Schema not allowed (${schema}), skipping:`, uri);
                    return { uri, diagnostics: [] };
                }
                const shouldCheck = await shouldValidateDocument(doc, settings);
                if (!shouldCheck) {
                    util_1.log('validateTextDocument skip:', uri);
                    return { uri, diagnostics: [] };
                }
                const settingsToUse = await getSettingsToUseForDocument(doc);
                if (settingsToUse.enabled) {
                    util_1.logInfo('Validate File', uri);
                    util_1.log('validateTextDocument start:', uri);
                    const diagnostics = await Validator.validateTextDocument(doc, settingsToUse);
                    util_1.log('validateTextDocument done:', uri);
                    return { uri, diagnostics };
                }
            }
            catch (e) {
                util_1.logError(`validateTextDocument: ${JSON.stringify(e)}`);
            }
            return { uri, diagnostics: [] };
        }
        isValidationBusy = true;
        const r = await validate();
        isValidationBusy = false;
        return r;
    }
    // Make the text document manager listen on the connection
    // for open, change and close text document events
    documents.listen(connection);
    // The content of a text document has changed. This event is emitted
    // when the text document first opened or when its content has changed.
    documents.onDidChangeContent((change) => {
        validationRequestStream.next(change.document);
    });
    documents.onDidClose((event) => {
        const uri = event.document.uri;
        const sub = validationByDoc.get(uri);
        if (sub) {
            validationByDoc.delete(uri);
            sub.unsubscribe();
        }
        // A text document was closed we clear the diagnostics
        connection.sendDiagnostics({ uri, diagnostics: [] });
    });
    connection.onCodeAction(codeActions_1.onCodeActionHandler(documents, getBaseSettings, () => documentSettings.version));
    // Listen on the connection
    connection.listen();
    // Free up the validation streams on shutdown.
    connection.onShutdown(() => {
        disposableValidate.unsubscribe();
        disposableTriggerUpdateConfigStream.unsubscribe();
        disposableTriggerValidateAll.unsubscribe();
        const toDispose = [...validationByDoc.values()];
        validationByDoc.clear();
        toDispose.forEach(sub => sub.unsubscribe());
    });
    function updateLogLevel() {
        connection.workspace.getConfiguration({ section: 'cSpell.logLevel' }).then((result) => {
            fetchFolders();
            util_1.logger.level = result;
            util_1.logger.setConnection(connection);
        }, (reject) => {
            fetchFolders();
            util_1.logger.level = util_1.LogLevel.DEBUG;
            util_1.logger.error(`Failed to get config: ${JSON.stringify(reject)}`);
            util_1.logger.setConnection(connection);
        });
    }
    async function fetchFolders() {
        const folders = await connection.workspace.getWorkspaceFolders();
        if (folders) {
            util_1.setWorkspaceFolders(folders.map(f => f.uri));
        }
        else {
            util_1.setWorkspaceFolders([]);
        }
    }
}
run();
//# sourceMappingURL=server.js.map