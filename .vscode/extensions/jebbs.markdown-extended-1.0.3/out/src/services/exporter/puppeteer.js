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
const puppeteer = require("puppeteer");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const markdownDocument_1 = require("../common/markdownDocument");
const tools_1 = require("../common/tools");
const shared_1 = require("./shared");
const interfaces_1 = require("./interfaces");
const config_1 = require("../common/config");
const extension_1 = require("../../extension");
class PuppeteerExporter {
    Export(items, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = items.length;
            if (!this.checkPuppeteerBinary()) {
                let result = yield vscode.window.showInformationMessage("Do you want to download exporter dependency Chromium?", "Yes", "No");
                if (result == "Yes") {
                    yield this.fetchBinary(progress);
                }
                else {
                    vscode.window.showInformationMessage("Download cancelled. Try configure 'puppeteerExecutable' to use customize executable.");
                    return;
                }
            }
            let exec = config_1.config.puppeteerExecutable;
            let opt = exec ? {
                executablePath: exec
            } : undefined;
            progress.report({ message: "Initializing..." });
            const browser = yield puppeteer.launch(opt);
            const page = yield browser.newPage();
            return items.reduce((p, c, i) => {
                return p
                    .then(() => {
                    if (progress)
                        progress.report({
                            message: `${path.basename(c.fileName)} (${i + 1}/${count})`,
                            increment: ~~(1 / count * 100)
                        });
                })
                    .then(() => this.exportFile(c, page));
            }, Promise.resolve(null)).then(() => __awaiter(this, void 0, void 0, function* () { return yield browser.close(); }));
        });
    }
    exportFile(item, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let document = new markdownDocument_1.MarkdownDocument(yield vscode.workspace.openTextDocument(item.uri));
            let inject = getInjectStyle(item.format);
            let html = shared_1.renderPage(document, inject);
            let ptConf = {};
            tools_1.mkdirsSync(path.dirname(item.fileName));
            yield page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
            switch (item.format) {
                case interfaces_1.exportFormat.PDF:
                    ptConf = tools_1.mergeSettings(config_1.config.puppeteerDefaultSetting.pdf, config_1.config.puppeteerUserSetting.pdf, document.meta.puppeteerPDF);
                    ptConf = Object.assign(ptConf, { path: item.fileName });
                    yield page.pdf(ptConf);
                    break;
                case interfaces_1.exportFormat.JPG:
                case interfaces_1.exportFormat.PNG:
                    ptConf = tools_1.mergeSettings(config_1.config.puppeteerDefaultSetting.image, config_1.config.puppeteerUserSetting.image, document.meta.puppeteerImage);
                    ptConf = Object.assign(ptConf, { path: item.fileName, type: item.format == interfaces_1.exportFormat.JPG ? "jpeg" : "png" });
                    if (item.format == interfaces_1.exportFormat.PNG)
                        ptConf.quality = undefined;
                    yield page.screenshot(ptConf);
                    break;
                default:
                    return Promise.reject("PuppeteerExporter does not support HTML export.");
            }
        });
    }
    FormatAvailable(format) {
        return [
            interfaces_1.exportFormat.PDF,
            interfaces_1.exportFormat.JPG,
            interfaces_1.exportFormat.PNG
        ].indexOf(format) > -1;
    }
    checkPuppeteerBinary() {
        return config_1.config.puppeteerExecutable || fs.existsSync(puppeteer.executablePath());
    }
    fetchBinary(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            let pt = require('puppeteer');
            let fetcher = pt.createBrowserFetcher();
            const revision = require(path.join(extension_1.context.extensionPath, 'node_modules', 'puppeteer', 'package.json')).puppeteer.chromium_revision;
            const revisionInfo = fetcher.revisionInfo(revision);
            let lastPg = 0;
            progress.report({
                message: "Downloading Chromium...",
            });
            return fetcher.download(revisionInfo.revision, (downloadedBytes, totalBytes) => {
                let pg = ~~(downloadedBytes / totalBytes * 100);
                if (pg - lastPg)
                    progress.report({
                        message: `Downloading Chromium...(${pg}%)`,
                        increment: pg - lastPg
                    });
                lastPg = pg;
            });
        });
    }
}
exports.puppeteerExporter = new PuppeteerExporter();
function getInjectStyle(formate) {
    switch (formate) {
        case interfaces_1.exportFormat.PDF:
            return `body, .vscode-body {
                max-width: 100% !important;
                width: 1000px !important;
                margin: 0!important;
                padding: 0!important;
            }`;
        case interfaces_1.exportFormat.JPG:
        case interfaces_1.exportFormat.PNG:
            return `body, .vscode-body {
                width: 1000px !important;
            }`;
        default:
            return "";
    }
}
//# sourceMappingURL=puppeteer.js.map