"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var child_process_1 = require("child_process");
// import path from "path";
var TaskResult = /** @class */ (function () {
    function TaskResult(success, message, output) {
        this.success = success;
        this.message = message || '';
        this.output = output || '';
    }
    return TaskResult;
}());
var TaskState;
(function (TaskState) {
    TaskState[TaskState["stopped"] = 0] = "stopped";
    TaskState[TaskState["finished"] = 1] = "finished";
    TaskState[TaskState["started"] = 2] = "started";
})(TaskState || (TaskState = {}));
var Task = /** @class */ (function () {
    function Task(command, verbose) {
        this.state = TaskState.stopped;
        this.command = command;
        this.verbose = verbose || false;
    }
    Task.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            child_process_1.exec(_this.command, function (error, stdout, stderr) {
                if (error) {
                    _this.state = TaskState.finished;
                    _this.result = new TaskResult(false, error.message, stderr);
                    return reject(_this.result);
                }
                _this.state = TaskState.finished;
                _this.result = new TaskResult(true, '', stdout);
                resolve(_this.result);
            });
        });
    };
    Task.prototype.toString = function () {
        return this.command;
    };
    Task.buildTask = function (config, file) {
        var filePath = file; //path.resolve(file).normalize();
        var command = config.getCommand();
        var replacer = config.getReplacer();
        var argPath = replacer ? replacer(filePath) : filePath;
        if (config.isSpaceEscapingEnabled())
            argPath = argPath.replace(/\ /g, '\\ ');
        return new Task(command + " " + argPath, config.isTaskOutPutVerbose());
    };
    return Task;
}());
exports.Task = Task;
