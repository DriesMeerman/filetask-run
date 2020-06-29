import { Config } from "./utilities/Config";
import {exec} from "child_process";
import path from "path";

export class TaskResult{
    success: boolean;
    message: string;
    output: string;

    constructor(success: boolean, message?: string, output?: string) {
        this.success = success;
        this.message = message || '';
        this.output = output || '';
    }
}

export enum TaskState {
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

    getCommand(): string {
        return this.command;
    }

    start(): Promise<TaskResult>{
        return new Promise((resolve, reject) => {
            exec(this.getCommand(), (error, stdout, stderr)=>{
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
        return this.getCommand();
    }
}