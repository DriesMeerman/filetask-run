"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskState = exports.TaskResult = void 0;
var child_process_1 = require("child_process");
var TaskResult = /** @class */ (function () {
    function TaskResult(success, message, output) {
        this.success = success;
        this.message = message || '';
        this.output = output || '';
    }
    return TaskResult;
}());
exports.TaskResult = TaskResult;
var TaskState;
(function (TaskState) {
    TaskState[TaskState["stopped"] = 0] = "stopped";
    TaskState[TaskState["finished"] = 1] = "finished";
    TaskState[TaskState["started"] = 2] = "started";
})(TaskState = exports.TaskState || (exports.TaskState = {}));
var Task = /** @class */ (function () {
    function Task(command, verbose) {
        this.state = TaskState.stopped;
        this.command = command;
        this.verbose = verbose || false;
    }
    Task.prototype.getCommand = function () {
        return this.command;
    };
    Task.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            child_process_1.exec(_this.getCommand(), function (error, stdout, stderr) {
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
        return this.getCommand();
    };
    return Task;
}());
exports.Task = Task;
