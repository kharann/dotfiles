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
const path = require("path");
const vscode = require("vscode");
const mume = require("@shd101wyy/mume");
const mume_1 = require("@shd101wyy/mume");
const config_1 = require("./config");
let singlePreviewSouceUri = null;
// http://www.typescriptlang.org/play/
// https://github.com/Microsoft/vscode/blob/master/extensions/markdown/media/main.js
// https://github.com/Microsoft/vscode/tree/master/extensions/markdown/src
// https://github.com/tomoki1207/gfm-preview/blob/master/src/gfmProvider.ts
// https://github.com/cbreeden/vscode-markdownit
class MarkdownPreviewEnhancedView {
    constructor(context) {
        this.context = context;
        this.privateOnDidChange = new vscode.EventEmitter();
        this.waiting = false;
        /**
         * The key is markdown file fsPath
         * value is MarkdownEngine
         */
        this.engineMaps = {};
        /**
         * The key is markdown file fsPath
         * value is JSAndCssFiles
         */
        this.jsAndCssFilesMaps = {};
        this.config = config_1.MarkdownPreviewEnhancedConfig.getCurrentConfig();
        mume
            .init() // init markdown-preview-enhanced
            .then(() => {
            mume.onDidChangeConfigFile(this.refreshAllPreviews.bind(this));
            mume_1.MarkdownEngine.onModifySource(this.modifySource.bind(this));
            const extensionVersion = require(path.resolve(this.context.extensionPath, "./package.json"))["version"];
            if (extensionVersion !== mume.configs.config["vscode_mpe_version"]) {
                mume.utility.updateExtensionConfig({
                    vscode_mpe_version: extensionVersion,
                });
                // openWelcomePage() // <== disable welcome page
            }
        });
    }
    refreshAllPreviews() {
        // reset configs
        for (const key in this.engineMaps) {
            if (this.engineMaps.hasOwnProperty(key)) {
                this.engineMaps[key].resetConfig();
            }
        }
        // refresh iframes
        vscode.workspace.textDocuments.forEach((document) => {
            if (document.uri.scheme === "markdown-preview-enhanced") {
                this.privateOnDidChange.fire(document.uri);
            }
        });
    }
    /**
     * modify markdown source, append `result` after corresponding code chunk.
     * @param codeChunkData
     * @param result
     * @param filePath
     */
    modifySource(codeChunkData, result, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            function insertResult(i, editor) {
                const lineCount = editor.document.lineCount;
                let start = 0;
                // find <!-- code_chunk_output -->
                for (let j = i + 1; j < i + 6 && j < lineCount; j++) {
                    if (editor.document
                        .lineAt(j)
                        .text.startsWith("<!-- code_chunk_output -->")) {
                        start = j;
                        break;
                    }
                }
                if (start) {
                    // found
                    // TODO: modify exited output
                    let end = start + 1;
                    while (end < lineCount) {
                        if (editor.document
                            .lineAt(end)
                            .text.startsWith("<!-- /code_chunk_output -->")) {
                            break;
                        }
                        end += 1;
                    }
                    // if output not changed, then no need to modify editor buffer
                    let r = "";
                    for (let i2 = start + 2; i2 < end - 1; i2++) {
                        r += editor.document.lineAt(i2).text + "\n";
                    }
                    if (r === result + "\n") {
                        return "";
                    } // no need to modify output
                    editor.edit((edit) => {
                        edit.replace(new vscode.Range(new vscode.Position(start + 2, 0), new vscode.Position(end - 1, 0)), result + "\n");
                    });
                    return "";
                }
                else {
                    editor.edit((edit) => {
                        edit.insert(new vscode.Position(i + 1, 0), `\n<!-- code_chunk_output -->\n\n${result}\n\n<!-- /code_chunk_output -->\n`);
                    });
                    return "";
                }
            }
            const visibleTextEditors = vscode.window.visibleTextEditors;
            for (let i = 0; i < visibleTextEditors.length; i++) {
                const editor = visibleTextEditors[i];
                if (this.formatPathIfNecessary(editor.document.uri.fsPath) === filePath) {
                    let codeChunkOffset = 0;
                    const targetCodeChunkOffset = codeChunkData.normalizedInfo.attributes["code_chunk_offset"];
                    const lineCount = editor.document.lineCount;
                    for (let i2 = 0; i2 < lineCount; i2++) {
                        const line = editor.document.lineAt(i2);
                        if (line.text.match(/^```(.+)\"?cmd\"?\s*[=\s}]/)) {
                            if (codeChunkOffset === targetCodeChunkOffset) {
                                i2 = i2 + 1;
                                while (i2 < lineCount) {
                                    if (editor.document.lineAt(i2).text.match(/^\`\`\`\s*/)) {
                                        break;
                                    }
                                    i2 += 1;
                                }
                                return insertResult(i2, editor);
                            }
                            else {
                                codeChunkOffset++;
                            }
                        }
                        else if (line.text.match(/\@import\s+(.+)\"?cmd\"?\s*[=\s}]/)) {
                            if (codeChunkOffset === targetCodeChunkOffset) {
                                // console.log('find code chunk' )
                                return insertResult(i2, editor);
                            }
                            else {
                                codeChunkOffset++;
                            }
                        }
                    }
                    break;
                }
            }
            return "";
        });
    }
    /**
     * return markdown engine of sourceUri
     * @param sourceUri
     */
    getEngine(sourceUri) {
        return this.engineMaps[sourceUri.fsPath];
    }
    /**
     * check if the markdown preview is on for the textEditor
     * @param textEditor
     */
    isPreviewOn(sourceUri) {
        if (useSinglePreview()) {
            return Object.keys(this.engineMaps).length >= 1;
        }
        return this.getEngine(sourceUri);
    }
    /**
     * remove engine from this.engineMaps
     * @param previewUri
     */
    destroyEngine(previewUri) {
        delete previewUri["markdown_source"];
        if (useSinglePreview()) {
            return (this.engineMaps = {});
        }
        const sourceUri = vscode.Uri.parse(previewUri.query);
        const engine = this.getEngine(sourceUri);
        if (engine) {
            // console.log('engine destroyed')
            this.engineMaps[sourceUri.fsPath] = null; // destroy engine
        }
    }
    /**
     * Format pathString if it is on Windows. Convert `c:\` like string to `C:\`
     * @param pathString
     */
    formatPathIfNecessary(pathString) {
        if (process.platform === "win32") {
            pathString = pathString.replace(/^([a-zA-Z])\:\\/, (_, $1) => `${$1.toUpperCase()}:\\`);
        }
        return pathString;
    }
    getProjectDirectoryPath(sourceUri, workspaceFolders = []) {
        const possibleWorkspaceFolders = workspaceFolders.filter((workspaceFolder) => {
            return (path
                .dirname(sourceUri.path.toUpperCase())
                .indexOf(workspaceFolder.uri.path.toUpperCase()) >= 0);
        });
        let projectDirectoryPath;
        if (possibleWorkspaceFolders.length) {
            // We pick the workspaceUri that has the longest path
            const workspaceFolder = possibleWorkspaceFolders.sort((x, y) => y.uri.fsPath.length - x.uri.fsPath.length)[0];
            projectDirectoryPath = workspaceFolder.uri.fsPath;
        }
        else {
            projectDirectoryPath = "";
        }
        return this.formatPathIfNecessary(projectDirectoryPath);
    }
    getFilePath(sourceUri) {
        return this.formatPathIfNecessary(sourceUri.fsPath);
    }
    /**
     * Initialize MarkdownEngine for this markdown file
     */
    initMarkdownEngine(sourceUri) {
        let engine = this.getEngine(sourceUri);
        if (!engine) {
            engine = new mume_1.MarkdownEngine({
                filePath: this.getFilePath(sourceUri),
                projectDirectoryPath: this.getProjectDirectoryPath(sourceUri, vscode.workspace.workspaceFolders),
                config: this.config,
            });
            this.engineMaps[sourceUri.fsPath] = engine;
            this.jsAndCssFilesMaps[sourceUri.fsPath] = [];
        }
        return engine;
    }
    provideTextDocumentContent(previewUri) {
        // console.log(sourceUri, uri, vscode.workspace.rootPath)
        let sourceUri;
        if (useSinglePreview()) {
            sourceUri = singlePreviewSouceUri;
        }
        else {
            sourceUri = vscode.Uri.parse(previewUri.query);
        }
        // console.log('open preview for source: ' + sourceUri.toString())
        let initialLine;
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.uri.fsPath === sourceUri.fsPath) {
            initialLine = editor.selection.active.line;
        }
        return vscode.workspace.openTextDocument(sourceUri).then((document) => {
            const text = document.getText();
            let engine = this.getEngine(sourceUri);
            if (!engine) {
                engine = this.initMarkdownEngine(sourceUri);
            }
            return engine.generateHTMLTemplateForPreview({
                inputString: text,
                config: {
                    previewUri: encodeURIComponent(previewUri.toString()),
                    sourceUri: encodeURIComponent(sourceUri.toString()),
                    initialLine,
                    vscode: true,
                },
            });
        });
    }
    updateMarkdown(sourceUri, triggeredBySave) {
        const engine = this.getEngine(sourceUri);
        if (!engine) {
            return;
        }
        // presentation mode
        if (engine.isPreviewInPresentationMode) {
            return this.privateOnDidChange.fire(getPreviewUri(sourceUri));
        }
        // not presentation mode
        vscode.workspace.openTextDocument(sourceUri).then((document) => {
            const text = document.getText();
            vscode.commands.executeCommand("_workbench.htmlPreview.postMessage", getPreviewUri(sourceUri), {
                command: "startParsingMarkdown",
            });
            engine
                .parseMD(text, {
                isForPreview: true,
                useRelativeFilePath: false,
                hideFrontMatter: false,
                triggeredBySave,
            })
                .then(({ markdown, html, tocHTML, JSAndCssFiles, yamlConfig }) => {
                // check JSAndCssFiles
                if (JSON.stringify(JSAndCssFiles) !==
                    JSON.stringify(this.jsAndCssFilesMaps[sourceUri.fsPath]) ||
                    yamlConfig["isPresentationMode"]) {
                    this.jsAndCssFilesMaps[sourceUri.fsPath] = JSAndCssFiles;
                    // restart iframe
                    this.privateOnDidChange.fire(getPreviewUri(sourceUri));
                }
                else {
                    vscode.commands.executeCommand("_workbench.htmlPreview.postMessage", getPreviewUri(sourceUri), {
                        command: "updateHTML",
                        html,
                        tocHTML,
                        totalLineCount: document.lineCount,
                        sourceUri: encodeURIComponent(sourceUri.toString()),
                        id: yamlConfig.id || "",
                        class: yamlConfig.class || "",
                    });
                }
            });
        });
    }
    refreshPreview(sourceUri) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine.clearCaches();
            // restart iframe
            this.privateOnDidChange.fire(getPreviewUri(sourceUri));
        }
    }
    openInBrowser(sourceUri) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine.openInBrowser({}).catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    htmlExport(sourceUri, offline) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .htmlExport({ offline })
                .then((dest) => {
                vscode.window.showInformationMessage(`File ${path.basename(dest)} was created at path: ${dest}`);
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    chromeExport(sourceUri, type) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .chromeExport({ fileType: type, openFileAfterGeneration: true })
                .then((dest) => {
                vscode.window.showInformationMessage(`File ${path.basename(dest)} was created at path: ${dest}`);
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    phantomjsExport(sourceUri, type) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .phantomjsExport({ fileType: type, openFileAfterGeneration: true })
                .then((dest) => {
                if (dest.endsWith("?print-pdf")) {
                    // presentation pdf
                    vscode.window.showInformationMessage(`Please copy and open the link: { ${dest.replace(/\_/g, "\\_")} } in Chrome then Print as Pdf.`);
                }
                else {
                    vscode.window.showInformationMessage(`File ${path.basename(dest)} was created at path: ${dest}`);
                }
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    princeExport(sourceUri) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .princeExport({ openFileAfterGeneration: true })
                .then((dest) => {
                if (dest.endsWith("?print-pdf")) {
                    // presentation pdf
                    vscode.window.showInformationMessage(`Please copy and open the link: { ${dest.replace(/\_/g, "\\_")} } in Chrome then Print as Pdf.`);
                }
                else {
                    vscode.window.showInformationMessage(`File ${path.basename(dest)} was created at path: ${dest}`);
                }
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    eBookExport(sourceUri, fileType) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .eBookExport({ fileType, runAllCodeChunks: false })
                .then((dest) => {
                vscode.window.showInformationMessage(`eBook ${path.basename(dest)} was created as path: ${dest}`);
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    pandocExport(sourceUri) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .pandocExport({ openFileAfterGeneration: true })
                .then((dest) => {
                vscode.window.showInformationMessage(`Document ${path.basename(dest)} was created as path: ${dest}`);
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    markdownExport(sourceUri) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine
                .markdownExport({})
                .then((dest) => {
                vscode.window.showInformationMessage(`Document ${path.basename(dest)} was created as path: ${dest}`);
            })
                .catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
    /*
    public cacheSVG(sourceUri: Uri, code:string, svg:string) {
      const engine = this.getEngine(sourceUri)
      if (engine) {
        engine.cacheSVG(code, svg)
      }
    }
    */
    cacheCodeChunkResult(sourceUri, id, result) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine.cacheCodeChunkResult(id, result);
        }
    }
    runCodeChunk(sourceUri, codeChunkId) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine.runCodeChunk(codeChunkId).then(() => {
                this.updateMarkdown(sourceUri);
            });
        }
    }
    runAllCodeChunks(sourceUri) {
        const engine = this.getEngine(sourceUri);
        if (engine) {
            engine.runCodeChunks().then(() => {
                this.updateMarkdown(sourceUri);
            });
        }
    }
    get onDidChange() {
        return this.privateOnDidChange.event;
    }
    update(sourceUri) {
        if (!this.config.liveUpdate) {
            return;
        }
        // console.log('update')
        if (!this.waiting) {
            this.waiting = true;
            setTimeout(() => {
                this.waiting = false;
                // this._onDidChange.fire(uri);
                this.updateMarkdown(sourceUri);
            }, 300);
        }
    }
    updateConfiguration() {
        const newConfig = config_1.MarkdownPreviewEnhancedConfig.getCurrentConfig();
        if (!this.config.isEqualTo(newConfig)) {
            this.config = newConfig;
            for (const fsPath in this.engineMaps) {
                if (this.engineMaps.hasOwnProperty(fsPath)) {
                    const engine = this.engineMaps[fsPath];
                    engine.updateConfiguration(newConfig);
                }
            }
            // update all generated md documents
            vscode.workspace.textDocuments.forEach((document) => {
                if (document.uri.scheme === "markdown-preview-enhanced") {
                    // this.update(document.uri);
                    this.privateOnDidChange.fire(document.uri);
                }
            });
        }
    }
    openImageHelper(sourceUri) {
        if (sourceUri.scheme === "markdown-preview-enhanced") {
            return vscode.window.showWarningMessage("Please focus a markdown file.");
        }
        else if (!this.isPreviewOn(sourceUri)) {
            return vscode.window.showWarningMessage("Please open preview first.");
        }
        else {
            vscode.commands.executeCommand("_workbench.htmlPreview.postMessage", getPreviewUri(sourceUri), {
                command: "openImageHelper",
            });
        }
    }
}
exports.MarkdownPreviewEnhancedView = MarkdownPreviewEnhancedView;
/**
 * check whehter to use only one preview or not
 */
function useSinglePreview() {
    const config = vscode.workspace.getConfiguration("markdown-preview-enhanced");
    return config.get("singlePreview");
}
exports.useSinglePreview = useSinglePreview;
function getPreviewUri(uri) {
    if (uri.scheme === "markdown-preview-enhanced") {
        return uri;
    }
    let previewUri;
    if (useSinglePreview()) {
        previewUri = uri.with({
            scheme: "markdown-preview-enhanced",
            path: "single-preview.rendered",
        });
        singlePreviewSouceUri = uri;
    }
    else {
        previewUri = uri.with({
            scheme: "markdown-preview-enhanced",
            path: uri.path + ".rendered",
            query: uri.toString(),
        });
    }
    return previewUri;
}
exports.getPreviewUri = getPreviewUri;
function isMarkdownFile(document) {
    return (document.languageId === "markdown" &&
        document.uri.scheme !== "markdown-preview-enhanced"); // prevent processing of own documents
}
exports.isMarkdownFile = isMarkdownFile;
function openWelcomePage() {
    const welcomeFilePath = mume.utility
        .addFileProtocol(path.resolve(__dirname, "../../docs/welcome.md"))
        .replace(/\\/g, "/");
    const uri = vscode.Uri.parse(welcomeFilePath);
    vscode.commands.executeCommand("vscode.open", uri).then(() => {
        vscode.commands.executeCommand("markdown-preview-enhanced.openPreview", uri);
    });
}
exports.openWelcomePage = openWelcomePage;
//# sourceMappingURL=preview-content-provider.js.map