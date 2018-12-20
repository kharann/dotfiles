"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_MODULE_LOAD = 'module_load';
exports.EVENT_TIMELINE_START = 'timeline_start';
const moduleStartTime = process.hrtime();
class PerformanceTimeline {
    constructor() {
        this.timeLine = [];
        this.timeLineEvents = new Map();
        this.mark(exports.EVENT_TIMELINE_START);
    }
    mark(name) {
        const event = { name, startTime: process.hrtime(moduleStartTime), duration: 0 };
        this.addEvent(event);
    }
    measure(name, nameStart, nameEnd) {
        const eventStart = this.timeLineEvents.get(nameStart) || this.timeLineEvents.get(exports.EVENT_TIMELINE_START);
        const eventEnd = this.timeLineEvents.get(nameEnd) || this.timeLineEvents.get(exports.EVENT_TIMELINE_START);
        const duration = calcDuration(eventStart.startTime, eventEnd.startTime);
        const event = { name, startTime: process.hrtime(moduleStartTime), duration };
        this.addEvent(event);
    }
    addEvent(event) {
        this.timeLine.push(event);
        this.timeLineEvents.set(event.name, event);
    }
    getEntries() {
        return this.timeLine;
    }
    getLatestEntryByName(name) {
        return this.timeLineEvents.get(name);
    }
    getEntriesByName(name) {
        return this.timeLine.filter(e => e.name === name);
    }
}
exports.PerformanceTimeline = PerformanceTimeline;
function calcDuration(a, b) {
    return toMilliseconds(b) - toMilliseconds(a);
}
exports.calcDuration = calcDuration;
function toMilliseconds(t) {
    return (t[0] + t[1] * 1.e-9) * 1000;
}
exports.toMilliseconds = toMilliseconds;
exports.performance = new PerformanceTimeline();
//# sourceMappingURL=perf.js.map