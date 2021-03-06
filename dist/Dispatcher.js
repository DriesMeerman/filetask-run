"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
var Logger_1 = require("./utilities/Logger");
var cli_progress_1 = __importDefault(require("cli-progress"));
var TaskFactory_1 = require("./utilities/TaskFactory");
var logger = new Logger_1.Logger();
var State;
(function (State) {
    State[State["started"] = 0] = "started";
    State[State["stopped"] = 1] = "stopped";
    State[State["paused"] = 2] = "paused";
    State[State["cancelled"] = 3] = "cancelled";
})(State || (State = {}));
var Dispatcher = /** @class */ (function () {
    function Dispatcher(tasks, verbose, onUpdate) {
        this.tasks = [];
        this.state = State.stopped;
        this.verbose = false;
        this.succeededTasks = 0;
        this.failedTasks = 0;
        this.tasks = tasks;
        this.verbose = verbose || false;
        this.onUpdate = onUpdate || null;
    }
    Dispatcher.prototype.size = function () {
        return this.tasks.length;
    };
    Dispatcher.prototype.addTask = function (task) {
        this.tasks.push(task);
    };
    Dispatcher.prototype.start = function (paralel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!paralel) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._start()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._startAsync()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Dispatcher.prototype.displayProgress = function () {
        if (this.verbose)
            return;
        logger.info("\n");
        var bar = new cli_progress_1.default.SingleBar({
            stopOnComplete: true,
        }, cli_progress_1.default.Presets.shades_classic);
        bar.start(this.size(), 0);
        var boundUpdate = this.onUpdate;
        if (boundUpdate) {
            this.onUpdate = function (last) {
                boundUpdate();
                bar.increment();
                if (last)
                    bar.stop();
            };
        }
        else {
            this.onUpdate = function (last) {
                bar.increment();
                if (last)
                    bar.stop();
            };
        }
    };
    Dispatcher.prototype._start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, task, result, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.tasks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        task = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, task.start()];
                    case 3:
                        result = _b.sent();
                        this.updateProgress();
                        if (this.verbose) {
                            logger.info("Task succeeded:\n", result.output);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _b.sent();
                        this.updateProgress(true);
                        if (this.verbose)
                            logger.error("\t", ex_1.output);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.logFailures();
                        return [2 /*return*/];
                }
            });
        });
    };
    Dispatcher.prototype._startAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, _a, task;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        results = [];
                        for (_i = 0, _a = this.tasks; _i < _a.length; _i++) {
                            task = _a[_i];
                            results.push(task.start().then(function (result) {
                                _this.updateProgress();
                                if (_this.verbose) {
                                    logger.info("Task success:\n\t", result.output);
                                }
                            }).catch(function (ex) {
                                _this.updateProgress(true);
                                if (_this.verbose)
                                    logger.error("\t", ex.output);
                            }));
                        }
                        return [4 /*yield*/, Promise.all(results)];
                    case 1:
                        _b.sent();
                        this.logFailures();
                        return [2 /*return*/];
                }
            });
        });
    };
    Dispatcher.prototype.logFailures = function () {
        var fails = this.tasks.filter(function (t) { var _a; return !((_a = t.result) === null || _a === void 0 ? void 0 : _a.success); });
        if (fails.length) {
            logger.info("\nFailures:\n");
            fails.forEach(function (t) { var _a; return logger.error(t.command + "\n\t", (_a = t.result) === null || _a === void 0 ? void 0 : _a.output); });
        }
        else {
            logger.info("\nNo failures\n");
        }
    };
    Dispatcher.prototype.updateProgress = function (failed, last) {
        if (failed)
            this.failedTasks++;
        else
            this.succeededTasks++;
        if (this.onUpdate)
            this.onUpdate(last);
    };
    Dispatcher.createTasks = function (config, files) {
        return files.map(function (file) { return TaskFactory_1.TaskFactory.buildTask(config, file); });
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
