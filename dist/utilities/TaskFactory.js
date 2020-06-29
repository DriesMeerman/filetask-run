"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = void 0;
var AdvancedTask_1 = require("../AdvancedTask");
var Task_1 = require("../Task");
var GlobHelper_1 = require("./GlobHelper");
var Logger_1 = require("./Logger");
var logger = new Logger_1.Logger();
var TaskFactory = /** @class */ (function () {
    function TaskFactory() {
    }
    TaskFactory.buildTask = function (config, file) {
        var replacer = config.getReplacer();
        var escapeSpace = config.isSpaceEscapingEnabled();
        var verboseTaskOutput = config.isTaskOutPutVerbose();
        if (config.isAdvanced()) {
            logger.debug("Running advanced command");
            return new AdvancedTask_1.AdvancedTask(config.getAdvancedCommand(), file, escapeSpace, replacer, verboseTaskOutput);
        }
        var filePath = GlobHelper_1.pathResolver(file);
        var command = config.getCommand();
        var argPath = replacer ? replacer(filePath) : filePath;
        if (escapeSpace)
            argPath = argPath.replace(/\ /g, '\\ ');
        return new Task_1.Task(command + " " + argPath, verboseTaskOutput);
    };
    return TaskFactory;
}());
exports.TaskFactory = TaskFactory;
