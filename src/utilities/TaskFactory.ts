import { AdvancedTask } from "../AdvancedTask";
import { Task } from "../Task";
import { Config } from "./Config";
import { pathResolver } from "./GlobHelper";
import { Logger } from "./Logger";
const logger = new Logger();

export class TaskFactory {
    static buildTask(config: Config, file: string) {
        const replacer = config.getReplacer();
        const escapeSpace = config.isSpaceEscapingEnabled();
        const verboseTaskOutput = config.isTaskOutPutVerbose();

        if (config.isAdvanced()) {
            logger.debug("Running advanced command");
            return new AdvancedTask(
                config.getAdvancedCommand(),
                file,
                escapeSpace,
                replacer,
                verboseTaskOutput
            );
        }

        const filePath = pathResolver(file);
        const command = config.getCommand();
        let argPath = replacer ? replacer(filePath) : filePath;

        if (escapeSpace)
            argPath = argPath.replace(/\ /g, '\\ ');

        return new Task(`${command} ${argPath}`, verboseTaskOutput);
    }
}