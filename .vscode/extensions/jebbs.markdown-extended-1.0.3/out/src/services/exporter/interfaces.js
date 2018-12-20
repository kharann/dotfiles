"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exportFormat;
(function (exportFormat) {
    exportFormat["PDF"] = "pdf";
    exportFormat["HTML"] = "html";
    exportFormat["JPG"] = "jpg";
    exportFormat["PNG"] = "png";
})(exportFormat = exports.exportFormat || (exports.exportFormat = {}));
var exporterType;
(function (exporterType) {
    exporterType[exporterType["HTML"] = 0] = "HTML";
    exporterType[exporterType["Phantom"] = 1] = "Phantom";
    exporterType[exporterType["Puppeteer"] = 2] = "Puppeteer";
})(exporterType = exports.exporterType || (exports.exporterType = {}));
//# sourceMappingURL=interfaces.js.map