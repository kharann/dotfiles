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
const logger_1 = require("./logger");
const vscode = require("vscode");
class Clipboard {
    static Copy(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield vscode.env.clipboard.writeText(text);
            }
            catch (e) {
                logger_1.logger.error(e, `Clipboard: Error copying to clipboard. err=${e}`);
            }
        });
    }
    static Paste() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode.env.clipboard.readText();
        });
    }
}
exports.Clipboard = Clipboard;

//# sourceMappingURL=clipboard.js.map
