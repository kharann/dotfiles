"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const interfaces_1 = require("./interfaces");
const html_1 = require("./html");
const puppeteer_1 = require("./puppeteer");
function pickFormat() {
    return __awaiter(this, void 0, void 0, function* () {
        let items = [
            {
                label: "Self-contained HTML",
                // description: "Export to self-contained HTML.",
                format: interfaces_1.exportFormat.HTML,
            },
            {
                label: "PDF File",
                // description: "Export to PDF.",
                format: interfaces_1.exportFormat.PDF,
            },
            {
                label: "PNG Image",
                // description: "Export to PNG image.",
                format: interfaces_1.exportFormat.PNG,
            },
            {
                label: "JPG Image",
                // description: "Export to jpg image.",
                format: interfaces_1.exportFormat.JPG,
            }
        ];
        let pick = yield vscode.window.showQuickPick(items, { placeHolder: `Select export format...` });
        if (!pick)
            return undefined;
        return pick.format;
    });
}
exports.pickFormat = pickFormat;
function pickExporter(format) {
    return __awaiter(this, void 0, void 0, function* () {
        let availableExporters = getAvailableExporters(format);
        if (availableExporters.length == 1)
            return availableExporters[0].exporter;
        let pick = yield vscode.window.showQuickPick(availableExporters, { placeHolder: `Select an exporter to export ${format}...` });
        if (!pick)
            return undefined;
        return pick.exporter;
    });
}
exports.pickExporter = pickExporter;
function getAvailableExporters(format) {
    let items = [];
    if (html_1.htmlExporter.FormatAvailable(format))
        items.push({
            label: "HTML Exporter",
            description: "export to html.",
            exporter: html_1.htmlExporter,
        });
    if (puppeteer_1.puppeteerExporter.FormatAvailable(format))
        items.push({
            label: "Puppeteer Exporter",
            description: "export to pdf/png/jpg.",
            exporter: puppeteer_1.puppeteerExporter,
        });
    return items;
}
//# sourceMappingURL=exporters.js.map