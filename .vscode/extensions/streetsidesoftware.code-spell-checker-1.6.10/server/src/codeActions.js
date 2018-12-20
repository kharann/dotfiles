"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LangServer = require("vscode-languageserver");
const cspell_1 = require("cspell");
const Validator = require("./validator");
const cspell = require("cspell");
const walker_1 = require("cspell-trie/dist/lib/walker");
const documentSettings_1 = require("./documentSettings");
const defaultNumSuggestions = 10;
const regexJoinedWords = /[+]/g;
const maxWordLengthForSuggestions = 20;
const wordLengthForLimitingSuggestions = 15;
const maxNumberOfSuggestionsForLongWords = 1;
const maxEdits = 3;
function extractText(textDocument, range) {
    const { start, end } = range;
    const offStart = textDocument.offsetAt(start);
    const offEnd = textDocument.offsetAt(end);
    return textDocument.getText().slice(offStart, offEnd);
}
function onCodeActionHandler(documents, fnSettings, fnSettingsVersion) {
    const settingsCache = new Map();
    async function getSettings(doc) {
        const cached = settingsCache.get(doc.uri);
        if (!cached || cached.docVersion !== doc.version) {
            const settings = constructSettings(doc);
            const settingsVersion = fnSettingsVersion(doc);
            settingsCache.set(doc.uri, { docVersion: doc.version, settings, settingsVersion });
        }
        return settingsCache.get(doc.uri).settings;
    }
    async function constructSettings(doc) {
        const docSetting = cspell.constructSettingsForText(await fnSettings(doc), doc.getText(), doc.languageId);
        const dict = await cspell.getDictionary(docSetting);
        return [docSetting, dict];
    }
    return async (params) => {
        const commands = [];
        const { context, textDocument: { uri } } = params;
        if (!documentSettings_1.isUriAllowed(uri)) {
            return [];
        }
        const { diagnostics } = context;
        const textDocument = documents.get(uri);
        const [docSetting, dictionary] = await getSettings(textDocument);
        const { numSuggestions = defaultNumSuggestions } = docSetting;
        function replaceText(range, text) {
            return LangServer.TextEdit.replace(range, text || '');
        }
        /*
        function genMultiWordSugs(word: string, words: string[]): string[] {
            const snakeCase = words.join('_').toLowerCase();
            const camelCase = Text.snakeToCamel(snakeCase);
            const sug = Text.isFirstCharacterUpper(word) ? Text.ucFirst(camelCase) : Text.lcFirst(camelCase);
            return [
                sug,
            ];
        }
        */
        function getSuggestions(dictionary, word, numSuggestions) {
            if (word.length > maxWordLengthForSuggestions) {
                return [];
            }
            const numSugs = word.length > wordLengthForLimitingSuggestions ? maxNumberOfSuggestionsForLongWords : numSuggestions;
            const numEdits = maxEdits;
            // Turn off compound suggestions for now until it works a bit better.
            return dictionary.suggest(word, numSugs, walker_1.CompoundWordsMethod.NONE, numEdits).map(sr => sr.word.replace(regexJoinedWords, ''));
        }
        function genSuggestions(dictionary) {
            const spellCheckerDiags = diagnostics.filter(diag => diag.source === Validator.diagSource);
            let diagWord;
            for (const diag of spellCheckerDiags) {
                const word = extractText(textDocument, diag.range);
                diagWord = diagWord || word;
                const sugs = getSuggestions(dictionary, word, numSuggestions);
                sugs
                    .map(sug => cspell_1.Text.matchCase(word, sug))
                    .forEach(sugWord => {
                    commands.push(LangServer.Command.create(sugWord, 'cSpell.editText', uri, textDocument.version, [replaceText(diag.range, sugWord)]));
                    /*
                    // Turn off making multiple suggestions for the same words.
                    const words = sugWord.replace(/[ _.]/g, '_').split('_');
                    if (words.length > 1) {
                        if (Text.isUpperCase(word)) {
                            const sug = words.join('_').toUpperCase();
                            commands.push(LangServer.Command.create(sug, 'cSpell.editText',
                                uri,
                                textDocument.version,
                                [ replaceText(diag.range, sug) ]
                            ));
                        } else {
                            genMultiWordSugs(word, words).forEach(sugWord => {
                                commands.push(LangServer.Command.create(sugWord, 'cSpell.editText',
                                    uri,
                                    textDocument.version,
                                    [ replaceText(diag.range, sugWord) ]
                                ));
                            });
                        }
                    }
                    */
                });
            }
            const word = diagWord || extractText(textDocument, params.range);
            // Only suggest adding if it is our diagnostic and there is a word.
            if (word && spellCheckerDiags.length) {
                commands.push(LangServer.Command.create('Add: "' + word + '" to dictionary', 'cSpell.addWordToUserDictionarySilent', word, textDocument.uri));
                // Allow the them to add it to the project dictionary.
                commands.push(LangServer.Command.create('Add: "' + word + '" to folder dictionary', 'cSpell.addWordToDictionarySilent', word, textDocument.uri));
                // Allow the them to add it to the workspace dictionary.
                commands.push(LangServer.Command.create('Add: "' + word + '" to workspace dictionary', 'cSpell.addWordToWorkspaceDictionarySilent', word, textDocument.uri));
            }
            return commands;
        }
        return genSuggestions(dictionary);
    };
}
exports.onCodeActionHandler = onCodeActionHandler;
//# sourceMappingURL=codeActions.js.map