"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("node-yaml");
class MetaData {
    constructor(data, uri) {
        this._uri = uri;
        this._meta = yaml.parse(data) || {};
    }
    get puppeteerPDF() {
        if (!this._meta.puppeteer)
            return {};
        return this._meta.puppeteer.pdf || {};
    }
    get puppeteerImage() {
        if (!this._meta.puppeteer)
            return {};
        return this._meta.puppeteer.image || {};
    }
}
exports.MetaData = MetaData;
//# sourceMappingURL=meta.js.map