"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const toggleFormat_1 = require("../services/helpers/toggleFormat");
const commands_1 = require("./commands");
const togglers = [
    {
        commandId: "markdownExtended.toggleBold",
        worker: toggle,
        args: [
            /\*\*(\S.*?\S)\*\*/ig, false,
            /(.+)/ig, "**$1**",
            /\*\*(\S.*?\S)\*\*/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleItalics",
        worker: toggle,
        args: [
            /\*(\S.*?\S)\*(?!=\*)/ig, false,
            /(.+)/ig, "*$1*",
            /\*(\S.*?\S)\*(?!=\*)/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleUnderLine",
        worker: toggle,
        args: [
            /_(\S.*?\S)_/ig, false,
            /(.+)/ig, "_$1_",
            /_(\S.*?\S)_/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleUpper",
        worker: toggle,
        args: [
            /\^(\S.*?\S)\^/ig, false,
            /(.+)/ig, "^$1^",
            /\^(\S.*?\S)\^/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleLower",
        worker: toggle,
        args: [
            /~(\S.*?\S)~(?!=~)/ig, false,
            /(.+)/ig, "~$1~",
            /~(\S.*?\S)~(?!=~)/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleStrikethrough",
        worker: toggle,
        args: [
            /~~(\S.*?\S)~~/ig, false,
            /(.+)/ig, "~~$1~~",
            /~~(\S.*?\S)~~/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleCodeInline",
        worker: toggle,
        args: [
            /`(\S.*?\S)`/ig, false,
            /(.+)/ig, "`$1`",
            /`(\S.*?\S)`/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleCodeBlock",
        worker: toggle,
        args: [
            /^```\r?\n[\S\s]+\r?\n```\s*$/ig, true,
            /((?:\S|\s)+)/ig, "```\n$1\n```",
            /^```\r?\n([\S\s]+)\r?\n```\s*$/ig, "$1",
        ]
    },
    {
        commandId: "markdownExtended.toggleUList",
        worker: toggle,
        args: [
            /((^|\n)-\s+(.+)\s*(?=$|\n))+/ig, true,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$1- $2",
            /(^|\n)-\s+(.+)\s*(?=$|\n)/ig, "$1$2",
        ]
    },
    {
        commandId: "markdownExtended.toggleOList",
        worker: toggle,
        args: [
            /((^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n))+/ig, true,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$11. $2",
            /(^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n)/ig, "$1$2",
        ]
    },
    {
        commandId: "markdownExtended.toggleBlockQuote",
        worker: toggle,
        args: [
            /((^|\n)>\s+(.+)\s*(?=$|\n))+/ig, true,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$1> $2",
            /(^|\n)>\s+(.+)\s*(?=$|\n)/ig, "$1$2",
        ]
    },
];
exports.commandToggles = new commands_1.Commands(togglers);
function toggle(detect, multiLine, on, onReplace, off, offReplace) {
    toggleFormat_1.toggleFormat(vscode.window.activeTextEditor.document, vscode.window.activeTextEditor.selection, detect, on, onReplace, off, offReplace, multiLine);
}
//# sourceMappingURL=helpers.js.map