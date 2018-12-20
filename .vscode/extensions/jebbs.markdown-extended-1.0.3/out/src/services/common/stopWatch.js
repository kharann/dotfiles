"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StopWatch {
    constructor() {
        this.start();
    }
    start() {
        this.startTime = new Date();
        this.endTime = undefined;
    }
    stop() {
        this.endTime = new Date();
        return this.duration;
    }
    get duration() {
        if (this.endTime)
            return this.endTime.getTime() - this.startTime.getTime();
        else
            return new Date().getTime() - this.startTime.getTime();
    }
}
exports.StopWatch = StopWatch;
//# sourceMappingURL=stopWatch.js.map