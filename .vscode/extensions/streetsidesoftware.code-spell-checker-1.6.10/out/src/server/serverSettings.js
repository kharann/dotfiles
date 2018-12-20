"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iso639_1_1 = require("../iso639-1");
const util = require("../util");
function extractLanguage(config) {
    return (config &&
        config.language &&
        normalizeToLocals(config.language)) || undefined;
}
exports.extractLanguage = extractLanguage;
function extractLocals(config = {}) {
    return extractLocalsFromLanguageSettings(config.languageSettings);
}
exports.extractLocals = extractLocals;
function extractLocalsFromLanguageSettings(langSettings = []) {
    const locals = langSettings
        .map(s => s.local || '')
        .map(normalizeLocal)
        .join(',');
    return normalizeToLocals(locals);
}
exports.extractLocalsFromLanguageSettings = extractLocalsFromLanguageSettings;
function extractDictionariesByLocal(config = {}) {
    return extractDictionariesByLocalLanguageSettings(config.languageSettings);
}
exports.extractDictionariesByLocal = extractDictionariesByLocal;
function extractDictionariesByLocalLanguageSettings(langSettings = []) {
    const mapOfDict = new Map();
    langSettings
        .map(({ local, dictionaries = [] }) => ({ local: normalizeLocal(local), dictionaries }))
        .filter(s => !!s.local)
        .filter(s => s.dictionaries.length > 0)
        .forEach(s => {
        s.local.split(',')
            .forEach(local => {
            mapOfDict.set(local, (mapOfDict.get(local) || []).concat(s.dictionaries).filter(util.uniqueFilter()));
        });
    });
    return mapOfDict;
}
exports.extractDictionariesByLocalLanguageSettings = extractDictionariesByLocalLanguageSettings;
function normalizeLocal(local = '') {
    if (Array.isArray(local)) {
        local = local.join(',');
    }
    return normalizeToLocals(local).join(',');
}
exports.normalizeLocal = normalizeLocal;
function normalizeToLocals(local = '') {
    return local
        .replace(/[|]/g, ',')
        .replace(/[*]/g, '')
        .split(',')
        .map(iso639_1_1.normalizeCode)
        .map(s => s.trim())
        .filter(a => !!a)
        .filter(util.uniqueFilter());
}
exports.normalizeToLocals = normalizeToLocals;
//# sourceMappingURL=serverSettings.js.map