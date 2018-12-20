"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const markdownItTOC_1 = require("./markdownItTOC");
const markdownItContainer_1 = require("./markdownItContainer");
const markdownItAnchorLink_1 = require("./markdownItAnchorLink");
const markdownItExportHelper_1 = require("./markdownItExportHelper");
const markdownItAdmonition_1 = require("./markdownItAdmonition");
exports.plugins = [
    { plugin: markdownItTOC_1.MarkdownItTOC },
    { plugin: markdownItAnchorLink_1.MarkdownItAnchorLink },
    { plugin: markdownItContainer_1.MarkdownItContainer },
    { plugin: markdownItAdmonition_1.MarkdownItAdmonition },
    { plugin: require('markdown-it-footnote') },
    { plugin: require('markdown-it-abbr') },
    { plugin: require('markdown-it-sup') },
    { plugin: require('markdown-it-sub') },
    { plugin: require('markdown-it-checkbox') },
    { plugin: require('markdown-it-attrs') },
    { plugin: require('markdown-it-kbd') },
    { plugin: require('markdown-it-underline') },
    { plugin: require('markdown-it-deflist') },
    { plugin: markdownItExportHelper_1.MarkdownItExportHelper }
];
//# sourceMappingURL=plugins.js.map