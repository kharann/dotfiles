"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class MarkdownPreviewEnhancedConfig {
    static getCurrentConfig() {
        return new MarkdownPreviewEnhancedConfig();
    }
    constructor() {
        const config = vscode.workspace.getConfiguration("markdown-preview-enhanced");
        this.usePandocParser = config.get("usePandocParser");
        this.breakOnSingleNewLine = config.get("breakOnSingleNewLine");
        this.enableTypographer = config.get("enableTypographer");
        this.enableWikiLinkSyntax = config.get("enableWikiLinkSyntax");
        this.enableLinkify = config.get("enableLinkify");
        this.wikiLinkFileExtension = config.get("wikiLinkFileExtension");
        this.enableEmojiSyntax = config.get("enableEmojiSyntax");
        this.enableExtendedTableSyntax = config.get("enableExtendedTableSyntax");
        this.enableCriticMarkupSyntax = config.get("enableCriticMarkupSyntax");
        this.frontMatterRenderingOption = config.get("frontMatterRenderingOption");
        this.mermaidTheme = config.get("mermaidTheme");
        this.mathRenderingOption = config.get("mathRenderingOption");
        this.mathInlineDelimiters = config.get("mathInlineDelimiters");
        this.mathBlockDelimiters = config.get("mathBlockDelimiters");
        this.codeBlockTheme = config.get("codeBlockTheme");
        this.previewTheme = config.get("previewTheme");
        this.revealjsTheme = config.get("revealjsTheme");
        this.protocolsWhiteList = config.get("protocolsWhiteList");
        this.imageFolderPath = config.get("imageFolderPath");
        this.imageUploader = config.get("imageUploader");
        this.printBackground = config.get("printBackground");
        this.phantomPath = config.get("phantomPath");
        this.pandocPath = config.get("pandocPath");
        this.pandocMarkdownFlavor = config.get("pandocMarkdownFlavor");
        this.pandocArguments = config
            .get("pandocArguments")
            .split(",")
            .map((x) => x.trim());
        this.latexEngine = config.get("latexEngine");
        this.enableScriptExecution = config.get("enableScriptExecution");
        this.scrollSync = config.get("scrollSync");
        this.liveUpdate = config.get("liveUpdate");
    }
    isEqualTo(otherConfig) {
        const json1 = JSON.stringify(this);
        const json2 = JSON.stringify(otherConfig);
        return json1 === json2;
        // this is not good because sometimes this[key] is of array type
        /*
        for (let key in this) {
          if (this.hasOwnProperty(key)) {
            if (this[key] !== otherConfig[key]) {
              return false
            }
          }
        }
        */
    }
}
exports.MarkdownPreviewEnhancedConfig = MarkdownPreviewEnhancedConfig;
//# sourceMappingURL=config.js.map