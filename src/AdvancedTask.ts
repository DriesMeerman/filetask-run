import { Task } from "./Task";
import { pathResolver } from "./utilities/GlobHelper";
import { Logger } from "./utilities/Logger";
const logger = new Logger();

export class AdvancedTask extends Task {
    globPath: string;
    fullPath: string;
    replacedValue: string;

    constructor(
        command: string,
        globPath: string,
        escapeSpace = true,
        replacer?: null | ((input: string) => string),
        verbose?: boolean
    ) {
        super(command, verbose);
        this.globPath = globPath;
        this.fullPath = pathResolver(globPath);
        this.replacedValue = replacer ? replacer(this.fullPath) : '';

        
        if (escapeSpace) {
            const spaceRegex = /\ /g;
            const spaceEscapedString = '\\ ';

            this.globPath = this.globPath.replace(spaceRegex, spaceEscapedString);
            this.fullPath = this.fullPath.replace(spaceRegex, spaceEscapedString);
            this.replacedValue = this.replacedValue.replace(spaceRegex, spaceEscapedString);
        }
    }

    getCommand(): string {
        let cmd = this.command;
        cmd = cmd.replace('{full}', this.fullPath);
        cmd = cmd.replace('{glob}', this.globPath);
        cmd = cmd.replace('{replaced}', this.replacedValue);
        return cmd;
    }
}