"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watch = require('node-watch');
const watchedFiles = new Map();
function listener(event, name) {
    const watcher = watchedFiles.get(name);
    if (watcher) {
        watcher.callbacks.forEach(fn => fn(name, event));
    }
}
function isWatching(fileName) {
    return !!watchedFiles.get(fileName);
}
exports.isWatching = isWatching;
function stopWatching(fileName) {
    const watcher = watchedFiles.get(fileName);
    if (watcher) {
        watchedFiles.delete(fileName);
        watcher.watcher.close();
    }
}
exports.stopWatching = stopWatching;
function add(fileName, callback) {
    if (!watchedFiles.has(fileName)) {
        watchedFiles.set(fileName, {
            watcher: watch(fileName, listener),
            callbacks: new Set(),
        });
    }
    const watcher = watchedFiles.get(fileName);
    watcher.callbacks.add(callback);
}
exports.add = add;
function dispose() {
    for (const w of watchedFiles.values()) {
        w.watcher.close();
    }
    watchedFiles.clear();
}
exports.dispose = dispose;
//# sourceMappingURL=watcher.js.map