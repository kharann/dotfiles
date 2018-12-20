"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedSchemes = ['file', 'untitled'];
exports.setOfSupportedSchemes = new Set(exports.supportedSchemes);
function isSupportedUri(uri) {
    return !!uri && exports.setOfSupportedSchemes.has(uri.scheme);
}
exports.isSupportedUri = isSupportedUri;
function isSupportedDoc(doc) {
    return !!doc && !doc.isClosed && isSupportedUri(doc.uri);
}
exports.isSupportedDoc = isSupportedDoc;
//# sourceMappingURL=uriHelper.js.map