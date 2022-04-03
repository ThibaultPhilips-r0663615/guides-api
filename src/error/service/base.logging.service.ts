abstract class LoggingService {
    abstract writeErrorToLog(error: any): Promise<void>;
    abstract readAllErrorsFromLogs(numberOfWeeks?: number): Promise<[][]>;
    abstract readErrorsFromLogDate(date: Date): Promise<any[]>;
}

export { LoggingService }