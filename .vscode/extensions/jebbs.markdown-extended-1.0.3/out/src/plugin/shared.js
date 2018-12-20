"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function slugify(s) {
    // Unicode-friendly
    var spaceRegex = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;
    return encodeURIComponent(s.replace(spaceRegex, '-').toLowerCase());
}
exports.slugify = slugify;
//# sourceMappingURL=shared.js.map