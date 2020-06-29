import * as fs from 'fs';
import * as path from 'path';
import { Logger } from "./Logger";
import { Command } from 'commander';
import * as program from "commander";

const logger = new Logger();

const defaultConfigName: string = "taskConfig.json";

export class Config {

    path: string;
    config: any;
    replacer?: ((input: string) => string);

    constructor(path: string) {
        this.config = Config.loadConfigFile(path);
        this.path = path;
    }

    getCommand(): string {
        return this.config.command;
    }

    isAdvanced(): boolean {
        return this.config.hasOwnProperty('advanced');
    }

    getAdvancedCommand(): string {
        return this.config.advanced;
    }

    getReplacePattern(): RegExp | null {
        const key = "replacePattern";
        const value = this.getValueWithType(key, 'string');
        if (value === null) return null;

        return new RegExp(<string>value, 'g');
    }

    isSpaceEscapingEnabled(): boolean{
        return this.config.escapeSpace !== false;
    }

    isTaskOutPutVerbose(): boolean {
        return this.config.taskVerbose === true;
    }

    getReplaceValue(): string | null {
        const key = "replaceValue";
        const value = this.getValueWithType(key, 'string');
        if (value === null) return null;
        return <string>value;
    }

    getReplacer(): null | ((input: string) => string) {
        if (this.replacer) return this.replacer;

        const replace = this.getReplacePattern();
        const value = this.getReplaceValue();

        if (!replace || value === null) {
            return null;
        }

        logger.debug(`will replace ${replace} with "${value}"`);
        const replacerFunction = (input: string) => {
            return input.replace(replace, value)
        }
        this.replacer = replacerFunction;
        return replacerFunction;
    }

    getValueWithType(key: string, type: string): any {
        if (this.config.hasOwnProperty(key)) {
            const value = this.config[key];
            if (typeof (value) !== type) logger.warning(`${key} not valid expected ${type}, in config:`, this.path);

            return value;
        }
        return null;
    }

    static findConfigPath(): string | null {
        const cwd = process.cwd();
        const cwdConfig = path.join(cwd, defaultConfigName).normalize();
        const parentConfig = path.join(cwd, "../", defaultConfigName).normalize();

        try {
            if (fs.existsSync(cwdConfig)) {
                return cwdConfig;
            }
            if (fs.existsSync(parentConfig)) {
                return parentConfig;
            }
        } catch (err) {
            logger.error(err);
        }
        return null;
    }

    static loadConfigFile(path: string): any {
        try {
            const content = fs.readFileSync(path);
            return JSON.parse(content.toString());
        } catch (err) {
            logger.error(err);
        }
        return {};
    }

    static configFromCli(cli: program.Command): Config | null {
        let configPath;

        if (cli.config) {
            logger.debug("Running with config file:", cli.config);
            configPath = cli.config
        } else {
            configPath = Config.findConfigPath();
        }

        if (!configPath) {
            return null;
        }
        logger.debug('Found config file', configPath);

        return new Config(configPath);
    }
}