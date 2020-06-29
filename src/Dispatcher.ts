import { Task } from "./Task";
import { Config } from "./utilities/Config";
import { Logger } from "./utilities/Logger";
import cliProgress from "cli-progress";
import { TaskFactory } from "./utilities/TaskFactory";

const logger = new Logger();

enum State {
    started,
    stopped,
    paused,
    cancelled
}

export class Dispatcher {
    tasks: Task[] = [];
    state: State = State.stopped;
    verbose: boolean = false;
    succeededTasks: number = 0;
    failedTasks: number = 0;
    onUpdate: null | ((last?: boolean) => void);

    constructor(tasks: Task[], verbose?: boolean, onUpdate?: () => void) {
        this.tasks = tasks;
        this.verbose = verbose || false;
        this.onUpdate = onUpdate || null;
    }

    size(): number {
        return this.tasks.length;
    }

    addTask(task: Task) {
        this.tasks.push(task);
    }

    async start(paralel?: boolean) {
        if (!paralel) await this._start();
        else await this._startAsync();
    }

    displayProgress() {
        if (this.verbose) return;
        logger.info("\n");

        const bar = new cliProgress.SingleBar({
            stopOnComplete: true,
        }, cliProgress.Presets.shades_classic);
        bar.start(this.size(), 0);

        const boundUpdate = this.onUpdate;
        if (boundUpdate) {
            this.onUpdate = (last) => {
                boundUpdate();
                bar.increment();
                if (last) bar.stop();
            }
        } else {
            this.onUpdate = (last) => { 
                bar.increment();
                if (last) bar.stop();
            }
        }
    }

    async _start() {
        for (const task of this.tasks) {
            try {
                const result = await task.start();
                this.updateProgress();

                if (this.verbose) {
                    logger.info("Task succeeded:\n", result.output);
                }
            } catch (ex) {
                this.updateProgress(true);
                
                if (this.verbose)
                    logger.error("\t", ex.output);
            }
        }
        this.logFailures();
    }
    async _startAsync() {
        let results = [];
        for (const task of this.tasks) {
            results.push(task.start().then(result => {
                this.updateProgress();
                if (this.verbose) {
                    logger.info("Task success:\n\t", result.output);
                }
            }).catch( ex => {
                this.updateProgress(true);
            
                if (this.verbose)
                    logger.error("\t", ex.output);
            }))
        }
        await Promise.all(results);
        this.logFailures();
     }

    logFailures(){
        const fails = this.tasks.filter(t => !t.result?.success);

        if (fails.length){
            logger.info("\nFailures:\n");
            fails.forEach(t => logger.error(`${t.command}\n\t`, t.result?.output));
        } else {
            logger.info("\nNo failures\n");
        }
    }

    updateProgress(failed?: boolean, last?: boolean) {
        if (failed) this.failedTasks++;
        else this.succeededTasks++;
        if (this.onUpdate) this.onUpdate(last);
    }

    static createTasks(config: Config, files: string[]): Task[] {
        return files.map(file => TaskFactory.buildTask(config, file));
    }
}