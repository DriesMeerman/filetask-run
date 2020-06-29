"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedTask = void 0;
var Task_1 = require("./Task");
var GlobHelper_1 = require("./utilities/GlobHelper");
var Logger_1 = require("./utilities/Logger");
var logger = new Logger_1.Logger();
var AdvancedTask = /** @class */ (function (_super) {
    __extends(AdvancedTask, _super);
    function AdvancedTask(command, globPath, escapeSpace, replacer, verbose) {
        if (escapeSpace === void 0) { escapeSpace = true; }
        var _this = _super.call(this, command, verbose) || this;
        _this.globPath = globPath;
        _this.fullPath = GlobHelper_1.pathResolver(globPath);
        _this.replacedValue = replacer ? replacer(_this.fullPath) : '';
        if (escapeSpace) {
            var spaceRegex = /\ /g;
            var spaceEscapedString = '\\ ';
            _this.globPath = _this.globPath.replace(spaceRegex, spaceEscapedString);
            _this.fullPath = _this.fullPath.replace(spaceRegex, spaceEscapedString);
            _this.replacedValue = _this.replacedValue.replace(spaceRegex, spaceEscapedString);
        }
        return _this;
    }
    AdvancedTask.prototype.getCommand = function () {
        var cmd = this.command;
        cmd = cmd.replace('{full}', this.fullPath);
        cmd = cmd.replace('{glob}', this.globPath);
        cmd = cmd.replace('{replaced}', this.replacedValue);
        return cmd;
    };
    return AdvancedTask;
}(Task_1.Task));
exports.AdvancedTask = AdvancedTask;
