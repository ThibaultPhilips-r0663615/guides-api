import { LoggingService } from "./base.logging.service";
import { FileLoggingService } from "./file.logging.service";
import { GoogleLoggingService } from "./google.logging.service";

class LoggingContext {
    private static _Instance: LoggingContext = new LoggingContext();

    private loggingService: LoggingService;

    constructor() {
        if (LoggingContext._Instance) {
            throw new Error(`Error: Instantiation failed for ${LoggingContext.name} : Use SingletonClass.getInstance() instead of new.`);
        }
        LoggingContext._Instance = this;

        switch (process.env.LOGGING_TYPE) {
            case 'GOOGLE_API':
                this.loggingService = new GoogleLoggingService();
                break;
            case 'LOCAL_SYSTEM':
                this.loggingService = new FileLoggingService();
                break;
            default:
                this.loggingService = new GoogleLoggingService();
                break;
        }
    }

    public static GetInstance(): LoggingContext {
        return LoggingContext._Instance;
    }

    public GetLoggingService(): LoggingService {
        return this.loggingService;
    }
}

export { LoggingContext }