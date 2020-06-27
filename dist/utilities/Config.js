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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var Logger_1 = require("./Logger");
var logger = new Logger_1.Logger();
var defaultConfigName = "taskConfig.json";
var Config = /** @class */ (function () {
    function Config(path) {
        this.config = Config.loadConfigFile(path);
        this.path = path;
    }
    Config.prototype.getCommand = function () {
        return this.config.command;
    };
    Config.prototype.getReplacePattern = function () {
        var key = "replacePattern";
        var value = this.getValueWithType(key, 'string');
        if (value === null)
            return null;
        return new RegExp(value, 'g');
    };
    Config.prototype.isTaskOutPutVerbose = function () {
        return this.config.taskVerbose === true;
    };
    Config.prototype.getReplaceValue = function () {
        var key = "replaceValue";
        var value = this.getValueWithType(key, 'string');
        if (value === null)
            return null;
        return value;
    };
    Config.prototype.getReplacer = function () {
        if (this.replacer)
            return this.replacer;
        var replace = this.getReplacePattern();
        var value = this.getReplaceValue();
        if (!replace || value === null) {
            return null;
        }
        logger.debug("will replace " + replace + " with \"" + value + "\"");
        var replacerFunction = function (input) {
            return input.replace(replace, value);
        };
        this.replacer = replacerFunction;
        return replacerFunction;
    };
    Config.prototype.getValueWithType = function (key, type) {
        if (this.config.hasOwnProperty(key)) {
            var value = this.config[key];
            if (typeof (value) !== type)
                logger.warning(key + " not valid expected " + type + ", in config:", this.path);
            return value;
        }
        return null;
    };
    Config.findConfigPath = function () {
        var cwd = process.cwd();
        var cwdConfig = path.join(cwd, defaultConfigName).normalize();
        var parentConfig = path.join(cwd, "../", defaultConfigName).normalize();
        try {
            if (fs.existsSync(cwdConfig)) {
                return cwdConfig;
            }
            if (fs.existsSync(parentConfig)) {
                return parentConfig;
            }
        }
        catch (err) {
            logger.error(err);
        }
        return null;
    };
    Config.loadConfigFile = function (path) {
        try {
            var content = fs.readFileSync(path);
            return JSON.parse(content.toString());
        }
        catch (err) {
            logger.error(err);
        }
        return {};
    };
    Config.configFromCli = function (cli) {
        var configPath;
        if (cli.config) {
            logger.debug("Running with config file:", cli.config);
            configPath = cli.config;
        }
        else {
            configPath = Config.findConfigPath();
        }
        if (!configPath) {
            return null;
        }
        logger.debug('Found config file', configPath);
        return new Config(configPath);
    };
    return Config;
}());
exports.Config = Config;
