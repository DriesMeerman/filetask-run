export interface LogInterface {
    debug(message: String, ...extra: any[]): void;
    info(message: String, ...extra: any[]): void;
    warning(message: String, ...extra: any[]): void;
    error(message: String, ...extra: any[]): void;
}