"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobHelper = void 0;
// import * as glob from "glob";
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
function pathResolver(file) {
    return path_1.default.resolve(file).normalize();
}
var GlobHelper = /** @class */ (function () {
    function GlobHelper() {
    }
    GlobHelper.files = function (pattern, resolvedPath) {
        return new Promise(function (resolve, reject) {
            glob_1.default(pattern, function (err, matches) {
                if (err)
                    return reject(err);
                if (resolvedPath)
                    return resolve(matches.map(pathResolver));
                resolve(matches);
            });
        });
    };
    return GlobHelper;
}());
exports.GlobHelper = GlobHelper;
