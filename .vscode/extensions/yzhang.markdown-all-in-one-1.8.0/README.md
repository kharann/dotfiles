# Markdown Support for Visual Studio Code

[![version](https://img.shields.io/vscode-marketplace/v/yzhang.markdown-all-in-one.svg?style=flat-square&label=vscode%20marketplace)](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)  
[![installs](https://img.shields.io/vscode-marketplace/d/yzhang.markdown-all-in-one.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)  
[![AppVeyor](https://img.shields.io/appveyor/ci/neilsustc/vscode-markdown.svg?style=flat-square&label=appveyor%20build)](https://ci.appveyor.com/project/neilsustc/vscode-markdown)  
[![GitHub stars](https://img.shields.io/github/stars/neilsustc/vscode-markdown.svg?style=flat-square&label=github%20stars)](https://github.com/neilsustc/vscode-markdown)

All you need for Markdown (keyboard shortcuts, table of contents, auto preview and more).

## Features

- **Keyboard shortcuts** (toggle bold, italic, code span, strikethrough and heading)
  
  ![toggle bold](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/keybinding.gif) (toggle bold)
  
  ![toggle bold 2](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/keybinding2.gif) (even when there is no word selected)
  
  ![check task list](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/keybinding-tasklist.gif) (check/uncheck task list)
  
  See full key binding list in [keyboard shortcuts](#keyboard-shortcuts) section

- **Table of contents**

  ![toc](https://github.com/neilsustc/vscode-markdown/raw/master/images/toc.png)

  - The indentation rules (tab or spaces) of TOC will be the same of your current file (find it in the right bottom corner)
  
  - To make TOC compatible with GitHub, you need to set option `githubCompatibility` to `true`
  
  - Use `<!-- omit in toc -->` to ignore specific heading in TOC

- **List editing**
  
  ![on enter key 1](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/on-enter-key1.gif) (<kbd>Enter</kbd>)

  ![on enter key 2](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/on-enter-key2.gif) (<kbd>Enter</kbd>)

  ![on tab key](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/on-tab-key.gif) (<kbd>Tab</kbd>)

  ![on backspace key](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/on-backspace-key.gif) (<kbd>Backspace</kbd>)

  ![marker fixing](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/marker-fixing.gif) (auto fix ordered list markers)

- **Print Markdown to HTML**
  
  - Command `Markdown: Print current document to HTML`
  
  - It's recommended to print the exported HTML to PDF with browser (e.g. Chrome) if you want to share your documents with others

- **GitHub Flavored Markdown**
  
  - Table formatter
  
    ![table-formatter](https://github.com/neilsustc/vscode-markdown/raw/master/images/gifs/table-formatter.gif)

  - Task list

- **Math**
  
  ![math](https://github.com/neilsustc/vscode-markdown/raw/master/images/math.png)

- **Auto completions**

  ![image paths](https://github.com/neilsustc/vscode-markdown/raw/master/images/image-completions.png) (images paths)

  ![math completions](https://github.com/neilsustc/vscode-markdown/raw/master/images/math-completions.png) (math commands)

- **Others**
  
  - Override "Open Preview" keybinding with "Toggle Preview", which means you can close preview using the same keybinding (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>V</kbd>).

## Available Commands

- Markdown: Create Table of Contents
- Markdown: Update Table of Contents
- Markdown: Toggle code span
- Markdown: Print current document to HTML
- Markdown: Toggle math environment
- Markdown: Toggle unordered list

## Keyboard Shortcuts

| Key                                               | Command                      |
| ------------------------------------------------- | ---------------------------- |
| <kbd>Ctrl</kbd> + <kbd>B</kbd>                    | Toggle bold                  |
| <kbd>Ctrl</kbd> + <kbd>I</kbd>                    | Toggle italic                |
| <kbd>Alt</kbd> + <kbd>S</kbd>                     | Toggle strikethrough         |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>]</kbd> | Toggle heading (uplevel)     |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>[</kbd> | Toggle heading (downlevel)   |
| <kbd>Ctrl</kbd> + <kbd>M</kbd>                    | Toggle math environment      |
| <kbd>Alt</kbd> + <kbd>C</kbd>                     | Check/Uncheck task list item |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> | Toggle preview               |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>V</kbd>       | Toggle preview to side       |


Tip: `**word|**` -> `**word**|` (<kbd>Ctrl</kbd> + <kbd>B</kbd>)

## Supported Settings

| Name                                               | Default   | Description                                                       |
| -------------------------------------------------- | --------- | ----------------------------------------------------------------- |
| `markdown.extension.toc.levels`                    | `1..6`    | Control the heading levels to show in the table of contents.      |
| `markdown.extension.toc.unorderedList.marker`      | `-`       | Use `-`, `*` or `+` in the table of contents (for unordered list) |
| `markdown.extension.toc.orderedList`               | `false`   | Use ordered list in the table of contents.                        |
| `markdown.extension.toc.plaintext`                 | `false`   | Just plain text.                                                  |
| `markdown.extension.toc.updateOnSave`              | `true`    | Automatically update the table of contents on save.               |
| `markdown.extension.toc.githubCompatibility`       | `false`   | GitHub compatibility                                              |
| `markdown.extension.preview.autoShowPreviewToSide` | `false`   | Automatically show preview when opening a Markdown file.          |
| `markdown.extension.orderedList.marker`            | `ordered` | Or `one`: always use `1.` as ordered list marker                  |
| `markdown.extension.orderedList.autoRenumber`      | `true`    | Auto fix list markers as you edits                                |
| `markdown.extension.italic.indicator`              | `*`       | Use `*` or `_` to wrap italic text                                |
| `markdown.extension.showExplorer`                  | `true`    | Show outline view in explorer panel                               |
| `markdown.extension.print.absoluteImgPath`         | `true`    | Convert image path to absolute path                               |
| `markdown.extension.print.imgToBase64`             | `false`   | Convert images to base64 when printing to HTML                    |
| `markdown.extension.syntax.decorations`            | `true`    | Add decorations to strikethrough and code spans                   |
| `markdown.extension.syntax.plainTheme`             | `false`   | A distraction-free theme                                          |
| `markdown.extension.toc.tabSize`                   | `auto`    | Control the indentation size of TOC (`auto` or a number)          |

## Changelog

See [CHANGELOG](https://github.com/neilsustc/vscode-markdown/blob/master/CHANGELOG.md) for more information.

## Latest Development Build

Download it [here](https://ci.appveyor.com/project/neilsustc/vscode-markdown/build/artifacts).

To install, execute `Extensions: Install from VSIX...` in the Command Palette (`ctrl + shift + p`)

## Contributing

Bugs, feature requests and more, in [GitHub Issues](https://github.com/neilsustc/vscode-markdown/issues).

Or leave a review on [vscode marketplace](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one#review-details) 😉.
