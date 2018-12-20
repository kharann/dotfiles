"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cspell_1 = require("cspell");
exports.diagSource = 'cSpell Checker';
var cspell_2 = require("cspell");
exports.validateText = cspell_2.validateText;
exports.defaultCheckLimit = 500;
const diagSeverityMap = new Map([
    ['error', vscode_languageserver_1.DiagnosticSeverity.Error],
    ['warning', vscode_languageserver_1.DiagnosticSeverity.Warning],
    ['information', vscode_languageserver_1.DiagnosticSeverity.Information],
    ['hint', vscode_languageserver_1.DiagnosticSeverity.Hint],
]);
function validateTextDocument(textDocument, options) {
    return validateTextDocumentAsync(textDocument, options)
        .pipe(operators_1.toArray())
        .toPromise();
}
exports.validateTextDocument = validateTextDocument;
function validateTextDocumentAsync(textDocument, options) {
    const { diagnosticLevel = vscode_languageserver_1.DiagnosticSeverity.Information.toString() } = options;
    const severity = diagSeverityMap.get(diagnosticLevel.toLowerCase()) || vscode_languageserver_1.DiagnosticSeverity.Information;
    const limit = (options.checkLimit || exports.defaultCheckLimit) * 1024;
    const text = textDocument.getText().slice(0, limit);
    return rxjs_1.from(cspell_1.validateText(text, options)).pipe(operators_1.flatMap(a => a), operators_1.filter(a => !!a), operators_1.map(a => a), 
    // Convert the offset into a position
    operators_1.map(offsetWord => (Object.assign({}, offsetWord, { position: textDocument.positionAt(offsetWord.offset) }))), 
    // Calculate the range
    operators_1.map(word => (Object.assign({}, word, { range: {
            start: word.position,
            end: (Object.assign({}, word.position, { character: word.position.character + word.text.length }))
        } }))), 
    // Convert it to a Diagnostic
    operators_1.map(({ text, range }) => ({
        severity,
        range: range,
        message: `Unknown word: "${text}"`,
        source: exports.diagSource
    })));
}
exports.validateTextDocumentAsync = validateTextDocumentAsync;
//# sourceMappingURL=validator.js.map