import fs from 'fs';
import path from 'path';
import { readdir } from 'fs/promises';
import { Severity } from '@google-cloud/logging';
import { LoggingService } from './base.logging.service';

const logsDirectory = path.normalize(`${process.cwd()}/${process.env.LOG_DIR}`);

class FileLoggingService extends LoggingService {

    writeErrorToLog = async (error: any, severity: Severity = 3) => {
        try {
            const date: Date = new Date();
            const currentLogElements = await this.readErrorsFromLogDate(date);
            currentLogElements.push({ logName: error.name, timestamp: error.date, id: error.id, errorMessage: error.errorMessage, errorStack: error.errorStack })
            fs.writeFile(`${logsDirectory}/${Severity[severity]}_log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`, JSON.stringify(currentLogElements), err => {
                if (err)
                    console.log(err)
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    readAllErrorsFromLogs = async (numberOfWeeks: number = 1): Promise<[][]> => {
        try {
            var date = new Date();
            date.setDate(date.getDate() - (numberOfWeeks * 7));

            let result: [][] = [];
            const files = await readdir(logsDirectory);
            files.forEach((fileName) => {
                let fileDate: Date = new Date(fileName.split('-').slice(1).join('-').split('.')[0]);
                console.log(fileDate);

                if (fileDate > date) {
                    const data = fs.readFileSync(`${logsDirectory}/${fileName}`, 'utf8');
                    result.push(JSON.parse(data));
                }
            })
            return result;
        }
        catch (fileError) {
            return Promise.reject();
            // return Promise.reject(await this.writeErrorToLog(fileError).catch((err) => console.log(err)))
        }
    }

    readErrorsFromLogDate = async (date: Date): Promise<any[]> => {
        try {
            const fileName = `${logsDirectory}/error_log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
            if (!fs.existsSync(fileName)) return Promise.resolve([]);
            const data = fs.readFileSync(fileName, 'utf8');
            return Promise.resolve(JSON.parse(data));
        }
        catch (fileError) {
            return Promise.reject();
            //return Promise.reject(await this.writeErrorToLog(fileError).catch((err) => console.log(err)))
        }
    }
}

export { FileLoggingService }