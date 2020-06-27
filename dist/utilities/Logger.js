"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// wrapper so proper logger can be implemented later
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.debug = function (message) {
        var extra = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extra[_i - 1] = arguments[_i];
        }
        if (process.env.taskRunDebug === 'true')
            this.info.apply(this, __spreadArrays([message], extra));
    };
    Logger.prototype.info = function (message) {
        var extra = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extra[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArrays([message], extra));
    };
    Logger.prototype.warning = function (message) {
        var extra = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extra[_i - 1] = arguments[_i];
        }
        console.warn.apply(console, __spreadArrays([message], extra));
    };
    Logger.prototype.error = function (message) {
        var extra = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extra[_i - 1] = arguments[_i];
        }
        console.error.apply(console, __spreadArrays([message], extra));
    };
    return Logger;
}());
exports.Logger = Logger;
