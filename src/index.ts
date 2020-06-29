import * as program from "commander";
import { Logger } from "./utilities/Logger";
import { Config } from "./utilities/Config";
import { GlobHelper } from "./utilities/GlobHelper";
import { Dispatcher } from "./Dispatcher";

const logger = new Logger();

const cli: program.Command = program.program
    .version("1.2.0")
    .usage("[options]")
    .option("-c, --config <path>", "Path to config file, will try taskConfig.json in both current and parent directory as default")


cli.command("test <pattern>")
    .alias("t")
    .description("Do a dry run that lists the files that are captured by the glob pattern")
    .action(async (pattern) => {
        logger.debug("Running command - test:", pattern);
        const config = Config.configFromCli(cli);
        let files;

        if (!config) {
            process.exit(1);
        }

        logger.debug("Running with: ", config.config)
        logger.debug("Searching for files with glob", pattern);
        try {
            files = await GlobHelper.files(pattern);
            logger.debug("Found files:", files);
            const tasks = Dispatcher.createTasks(config, files);
            tasks.forEach(t => logger.info(t.toString()));
        } catch (ex) {
            logger.error(ex);
        }
    });

cli.command("run <pattern> [parallel]")
    .alias("r")
    .description("Executes the command with files from the input glob based on the configuration")
    .action(async (pattern, parallel) => {
        logger.debug("Running command - run:", pattern, parallel);
        const config = Config.configFromCli(cli);
        let files;

        if (!config) {
            process.exit(1);
        }

        logger.debug("Running with: ", config.config)
        logger.debug("Searching for files with glob", pattern);
        try {
            files = await GlobHelper.files(pattern, true);
            logger.debug("Found files:", files);
            const logOutput = config.isTaskOutPutVerbose();
            const dispatcher = new Dispatcher(Dispatcher.createTasks(config, files), logOutput);
            dispatcher.displayProgress();
            await dispatcher.start(Boolean(parallel));
        } catch (ex) {
            logger.error(ex);
        }
    })


cli.parse(process.argv);

if (process.argv.length < 3) {
    cli.help();
}