"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSpellSettings = require("./settings/CSpellSettings");
const Settings = require("./settings");
const vscode_1 = require("vscode");
var settings_1 = require("./settings");
exports.toggleEnableSpellChecker = settings_1.toggleEnableSpellChecker;
exports.enableCurrentLanguage = settings_1.enableCurrentLanguage;
exports.disableCurrentLanguage = settings_1.disableCurrentLanguage;
function handlerApplyTextEdits(client) {
    return function applyTextEdits(uri, documentVersion, edits) {
        const textEditor = vscode_1.window.activeTextEditor;
        if (textEditor && textEditor.document.uri.toString() === uri) {
            if (textEditor.document.version !== documentVersion) {
                vscode_1.window.showInformationMessage(`Spelling changes are outdated and cannot be applied to the document.`);
            }
            textEditor.edit(mutator => {
                for (const edit of edits) {
                    mutator.replace(client.protocol2CodeConverter.asRange(edit.range), edit.newText);
                }
            }).then((success) => {
                if (!success) {
                    vscode_1.window.showErrorMessage('Failed to apply spelling changes to the document.');
                }
            });
        }
    };
}
exports.handlerApplyTextEdits = handlerApplyTextEdits;
function addWordToFolderDictionary(word, uri) {
    return addWordToTarget(word, Settings.Target.WorkspaceFolder, uri);
}
exports.addWordToFolderDictionary = addWordToFolderDictionary;
function addWordToWorkspaceDictionary(word, uri) {
    return addWordToTarget(word, Settings.Target.Workspace, uri);
}
exports.addWordToWorkspaceDictionary = addWordToWorkspaceDictionary;
function addWordToUserDictionary(word) {
    return addWordToTarget(word, Settings.Target.Global, undefined);
}
exports.addWordToUserDictionary = addWordToUserDictionary;
async function addWordToTarget(word, target, uri) {
    const actualTarget = resolveTarget(target, uri);
    await Settings.addWordToSettings(actualTarget, word);
    if (actualTarget !== Settings.Target.Global) {
        const useUri = uri ? pathToUri(uri) : undefined;
        const path = await Settings.findExistingSettingsFileLocation(useUri);
        if (path) {
            await CSpellSettings.addWordToSettingsAndUpdate(path, word);
        }
    }
}
function removeWordFromFolderDictionary(word, uri) {
    return removeWordFromTarget(word, Settings.Target.WorkspaceFolder, uri);
}
exports.removeWordFromFolderDictionary = removeWordFromFolderDictionary;
function removeWordFromWorkspaceDictionary(word, uri) {
    return removeWordFromTarget(word, Settings.Target.Workspace, uri);
}
exports.removeWordFromWorkspaceDictionary = removeWordFromWorkspaceDictionary;
function removeWordFromUserDictionary(word) {
    return removeWordFromTarget(word, Settings.Target.Global, undefined);
}
exports.removeWordFromUserDictionary = removeWordFromUserDictionary;
async function removeWordFromTarget(word, target, uri) {
    const actualTarget = resolveTarget(target, uri);
    await Settings.removeWordFromSettings(actualTarget, word);
    if (actualTarget !== Settings.Target.Global) {
        const useUri = uri ? pathToUri(uri) : undefined;
        const path = await Settings.findExistingSettingsFileLocation(useUri);
        if (path) {
            await CSpellSettings.removeWordFromSettingsAndUpdate(path, word);
        }
    }
}
function resolveTarget(target, uri) {
    if (target === Settings.Target.Global || !Settings.hasWorkspaceLocation()) {
        return Settings.Target.Global;
    }
    if (!uri) {
        return Settings.Target.Workspace;
    }
    const resolvedUri = pathToUri(uri);
    return Settings.createTargetForUri(Settings.Target.Workspace, resolvedUri);
}
function enableLanguageId(languageId, uri) {
    if (languageId) {
        return Settings.enableLanguage(Settings.Target.Global, languageId)
            .then(() => {
            // Add it from the workspace as well if necessary
            const allSettings = Settings.getEnabledLanguagesFromConfig(Settings.Scopes.Workspace);
            if (allSettings) {
                return Settings.enableLanguage(Settings.Target.Workspace, languageId);
            }
        });
    }
    return Promise.resolve();
}
exports.enableLanguageId = enableLanguageId;
function disableLanguageId(languageId, uri) {
    if (languageId) {
        return Settings.disableLanguage(Settings.Target.Global, languageId)
            .then(() => {
            // Remove it from the workspace as well if necessary
            const allSettings = Settings.getEnabledLanguagesFromConfig(Settings.Scopes.Workspace);
            if (allSettings) {
                return Settings.disableLanguage(Settings.Target.Workspace, languageId);
            }
        });
    }
    return Promise.resolve();
}
exports.disableLanguageId = disableLanguageId;
function userCommandOnCurrentSelectionOrPrompt(prompt, fnAction) {
    return function () {
        const { activeTextEditor = {} } = vscode_1.window;
        const { selection, document } = activeTextEditor;
        const range = selection && document ? document.getWordRangeAtPosition(selection.active) : undefined;
        const value = range ? document.getText(selection) || document.getText(range) : selection && document.getText(selection) || '';
        return (selection && !selection.isEmpty)
            ? fnAction(value)
            : vscode_1.window.showInputBox({ prompt, value }).then(word => { word && fnAction(word); });
    };
}
exports.userCommandOnCurrentSelectionOrPrompt = userCommandOnCurrentSelectionOrPrompt;
function pathToUri(uri) {
    if (uri instanceof vscode_1.Uri) {
        return uri;
    }
    return vscode_1.Uri.parse(uri);
}
//# sourceMappingURL=commands.js.map