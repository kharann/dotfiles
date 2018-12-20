const assert = require('assert');
const underline = require('./index.js');
const md = require('markdown-it')().use(underline);

const tests = [
  { in: '*emphasis*', exp: '<em>emphasis</em>' },
  { in: '**strong**', exp: '<strong>strong</strong>' },
  { in: '***strong emphasis***',
    exp: '<strong><em>strong emphasis</em></strong>' },
  { in: '_underline_', exp: '<u>underline</u>' },
  { in: '__strong__', exp: '<strong>strong</strong>' },
  { in: '___strong underline___',
    exp: '<strong><u>strong underline</u></strong>' },
];


tests.map(test => assert.equal(md.renderInline(test.in), test.exp))
