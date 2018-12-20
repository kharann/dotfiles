"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configReader_1 = require("./configReader");
const fs = require("fs");
class Config extends configReader_1.ConfigReader {
    constructor() {
        super('markdownExtended');
    }
    onChange() { }
    get tocLevels() {
        let conf = this.read('tocLevels');
        if (!(conf instanceof Array))
            conf = [];
        if (conf.length)
            conf = conf.filter(c => typeof c == "number");
        if (!conf.length)
            return [1, 2, 3];
        return conf;
    }
    get exportOutDirName() {
        return this.read('exportOutDirName');
    }
    get puppeteerExecutable() {
        let exe = this.read('puppeteerExecutable');
        return fs.existsSync(exe) ? exe : "";
    }
    get pdfFormat() {
        return this.read('pdfFormat');
    }
    get pdfWidth() {
        return this.read('pdfWidth');
    }
    get pdfHeight() {
        return this.read('pdfHeight');
    }
    get pdfLandscape() {
        return this.read('pdfLandscape');
    }
    get pdfMarginTop() {
        return this.read('pdfMarginTop');
    }
    get pdfMarginRight() {
        return this.read('pdfMarginRight');
    }
    get pdfMarginBottom() {
        return this.read('pdfMarginBottom');
    }
    get pdfMarginLeft() {
        return this.read('pdfMarginLeft');
    }
    get pdfDisplayHeaderFooter() {
        return this.read('pdfDisplayHeaderFooter');
    }
    get pdfPageRanges() {
        return this.read('pdfPageRanges');
    }
    get pdfHeaderTemplate() {
        return this.read('pdfHeaderTemplate');
    }
    get pdfFooterTemplate() {
        return this.read('pdfFooterTemplate');
    }
    get imageQuality() {
        return this.read('imageQuality') || 100;
    }
    get imageOmitBackground() {
        return this.read('imageOmitBackground');
    }
    get puppeteerDefaultSetting() {
        return {
            pdf: {
                printBackground: true,
            },
            image: {
                quality: 100,
                fullPage: true,
                omitBackground: false,
            }
        };
    }
    get puppeteerUserSetting() {
        return {
            pdf: {
                format: this.pdfFormat,
                width: this.pdfWidth,
                height: this.pdfHeight,
                landscape: this.pdfLandscape,
                margin: {
                    top: this.pdfMarginTop,
                    right: this.pdfMarginRight,
                    bottom: this.pdfMarginBottom,
                    left: this.pdfMarginLeft,
                },
                displayHeaderFooter: this.pdfDisplayHeaderFooter,
                pageRanges: this.pdfPageRanges,
                headerTemplate: this.pdfHeaderTemplate,
                footerTemplate: this.pdfFooterTemplate,
            },
            image: {
                quality: this.imageQuality,
                omitBackground: this.imageOmitBackground,
            }
        };
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map