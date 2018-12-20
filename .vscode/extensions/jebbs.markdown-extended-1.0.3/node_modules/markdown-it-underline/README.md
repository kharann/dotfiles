# markdown-it-underline
Renders this markdown

```md
_underline_ *emphasis*
```

to this HTML

```HTML
<u>underline</u> <em>emphasis</em>
```

This might not be semantic correct, but who cares :-)

See [the discussion at talk.commonmark.com](https://talk.commonmark.org/t/feature-request-underline-text/343).

## Install

```sh
npm install markdown-it-underline
```

## Usage

```js
const underline = require('markdown-it-underline');
const md = require('markdown-it')().use(underline);

console.log(md.renderInline('_underline_ *emphasis*'));
```

## Development

Add tests in [test.js](test.js).

```sh
npm test
npm version [patch|minor|major]
npm publish
```
