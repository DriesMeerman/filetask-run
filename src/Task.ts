import { Config } from "./utilities/Config";
import {exec} from "child_process";

// import path from "path";

class TaskResult{
    success: boolean;
    message: string;
    output: string;

    constructor(success: boolean, message?: string, output?: string) {
        this.success = success;
        this.message = message || '';
        this.output = output || '';
    }
}

enum TaskState {
    stopped,
    finished,
    started
}

export class Task {

    command: string;
    verbose: boolean;
    state: TaskState = TaskState.stopped;
    result?: TaskResult;

    constructor(command: string, verbose?: boolean) {
        this.command = command;
        this.verbose = verbose || false;
    }

    start(): Promise<TaskResult>{
        return new Promise((resolve, reject) => {
            exec(this.command, (error, stdout, stderr)=>{
                if (error) {
                    this.state = TaskState.finished;
                    this.result = new TaskResult(false, error.message, stderr);
                    return reject(this.result);
                }
                this.state = TaskState.finished;
                this.result = new TaskResult(true, '', stdout)
                resolve(this.result);
            });
        });
    }


    toString(): string {
        return this.command;
    }

    static buildTask(config: Config, file: string) {
        const filePath = file;//path.resolve(file).normalize();
        const command = config.getCommand();
        const replacer = config.getReplacer();
        const argPath = replacer ? replacer(filePath) : filePath;

        return new Task(`${command} ${argPath}`, config.isTaskOutPutVerbose());
    }
}