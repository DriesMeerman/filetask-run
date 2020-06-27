"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var program = __importStar(require("commander"));
var Logger_1 = require("./utilities/Logger");
var Config_1 = require("./utilities/Config");
var GlobHelper_1 = require("./utilities/GlobHelper");
var Dispatcher_1 = require("./Dispatcher");
var logger = new Logger_1.Logger();
var cli = program.program
    .version("1.0.0")
    .usage("[options]")
    .option("-c, --config <path>", "Path to config file, will try taskConfig.json in both current and parent directory as default");
cli.command("test <pattern>")
    .alias("t")
    .description("Do a dry run that lists the files that are captured by the glob pattern")
    .action(function (pattern) { return __awaiter(void 0, void 0, void 0, function () {
    var config, files, tasks, example, ex_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.debug("Running command - test:", pattern);
                config = Config_1.Config.configFromCli(cli);
                if (!config) {
                    process.exit(1);
                }
                logger.debug("Running with: ", config.config);
                logger.debug("Searching for files with glob", pattern);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, GlobHelper_1.GlobHelper.files(pattern, true)];
            case 2:
                files = _a.sent();
                tasks = Dispatcher_1.Dispatcher.createTasks(config, files);
                example = tasks.length > 0 ? tasks[0].toString() : '';
                // logger.info(`Would create ${tasks.length} tasks in the form of\n\t`, example);
                tasks.forEach(function (t) { return logger.info(t.toString()); });
                return [3 /*break*/, 4];
            case 3:
                ex_1 = _a.sent();
                logger.error(ex_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
cli.command("run <pattern> [parallel]")
    .alias("r")
    .description("Executes the command with files from the input glob based on the configuration")
    .action(function (pattern, parallel) { return __awaiter(void 0, void 0, void 0, function () {
    var config, files, logOutput, dispatcher, ex_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.debug("Running command - run:", pattern, parallel);
                config = Config_1.Config.configFromCli(cli);
                if (!config) {
                    process.exit(1);
                }
                logger.debug("Running with: ", config.config);
                logger.debug("Searching for files with glob", pattern);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, GlobHelper_1.GlobHelper.files(pattern, true)];
            case 2:
                files = _a.sent();
                logger.debug("Found files:", files);
                logOutput = config.isTaskOutPutVerbose();
                dispatcher = new Dispatcher_1.Dispatcher(Dispatcher_1.Dispatcher.createTasks(config, files), logOutput);
                dispatcher.displayProgress();
                return [4 /*yield*/, dispatcher.start(Boolean(parallel))];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                ex_2 = _a.sent();
                logger.error(ex_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
cli.parse(process.argv);
if (process.argv.length < 3) {
    cli.help();
    process.exit(0);
}