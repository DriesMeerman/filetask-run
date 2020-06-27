import { LogInterface } from "../interfaces/LogInterface";

// wrapper so proper logger can be implemented later
export class Logger implements LogInterface {
    debug(message: String, ...extra: any[]): void {
        if (process.env.taskRunDebug === 'true')
            this.info(message, ...extra);
    }
    info(message: String, ...extra: any[]): void {
        console.log(message, ...extra);
    }
    warning(message: String, ...extra: any[]): void {
        console.warn(message, ...extra);
    }
    error(message: String, ...extra: any[]): void {
        console.error(message, ...extra);
    }

}