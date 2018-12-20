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
const exporters_1 = require("../services/exporter/exporters");
const shared_1 = require("../services/exporter/shared");
const export_1 = require("../services/exporter/export");
const tools_1 = require("../services/common/tools");
function exportUri(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!shared_1.testMarkdown())
            return;
        let format = yield exporters_1.pickFormat();
        if (!format)
            return;
        let exporter = yield exporters_1.pickExporter(format);
        if (!exporter)
            return;
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Markdown Export`
        }, progress => export_1.MarkdownExport(uri, {
            exporter: exporter,
            progress: progress,
            format: format
        })).then(report => tools_1.showExportReport(report));
    });
}
exports.exportUri = exportUri;
//# sourceMappingURL=exportUri.js.map