import fs from 'fs';
import path from 'path';
import { Entry, GetEntriesResponse, Log, Logging, Severity } from '@google-cloud/logging';
import { Metadata } from '@google-cloud/logging/build/src/log';
import { LoggingService } from './base.logging.service';

const logsDirectory = path.normalize(`${process.cwd()}/logs`);
const logging: Logging = new Logging({ projectId: process.env.LOG_PROJECT_ID });

class GoogleLoggingService extends LoggingService {

    writeErrorToLog = async (error: any, severity: Severity = 3) => {
        try {

            const log: Log = logging.log(error.name);

            const data = {
                id: error.id,
                errorStack: error.errorStack,
                errorMessage: error.errorMessage
            };

            const metadata: Metadata = {
                resource: { type: 'global' },
                // See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
                severity: 'ERROR',
            };

            // Prepares a log entry
            const entry = log.entry(metadata, data);

            log.write(entry)
                .then(() => {
                    console.log(`Error log with id ${error.id} has been succesfully logged to the google cloud.`)
                })
                .catch(async (error) => {
                    const date: Date = new Date();
                    const currentLogElements = await this.readErrorsFromLogDate(date);
                    currentLogElements.push(error)

                    fs.writeFile(`${logsDirectory}/${Severity[severity]}_log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`, JSON.stringify(currentLogElements), err => {
                        if (err)
                            console.log(err)
                    })
                });

        }
        catch (fileError) {
            const date: Date = new Date();
            const currentLogElements = await this.readErrorsFromLogDate(date);
            currentLogElements.push(error)

            fs.writeFile(`${logsDirectory}/${Severity[severity]}_log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`, JSON.stringify(currentLogElements), (err) => {
                if (err)
                    console.log(err)
            })
        }
    }

    readAllErrorsFromLogs = async (numberOfWeeks: number = 1): Promise<[][]> => {
        try {
            var date = new Date();
            date.setDate(date.getDate() - (numberOfWeeks * 7));

            let filterObject = `logName:("projects/${process.env.FIREBASE_CONFIG_PROJECT_ID}/logs/InternalDataBaseError" OR "projects/${process.env.FIREBASE_CONFIG_PROJECT_ID}/logs/InternalServerError") severity:"ERROR" timestamp>"${date.toISOString()}"`;

            let googleLogEntries: GetEntriesResponse = (await logging.getEntries({
                filter: filterObject
            }).catch((err) => console.log(err)) as GetEntriesResponse);
            let resultLogEntries = googleLogEntries[0].map((entry: Entry) => (
                { logName: entry.metadata.logName, timestamp: entry.metadata.timestamp, id: entry.data.id, errorMessage: entry.data.errorMessage, errorStack: entry.data.errorStack }
            )) as any[];
            return resultLogEntries;
        }
        catch (fileError) {
            return Promise.reject(await this.writeErrorToLog(fileError).catch((err) => console.log(err)))
        }
    }

    readErrorsFromLogDate = async (date: Date): Promise<any[]> => {
        try {
            let filterObject = `logName:("projects/${process.env.FIREBASE_CONFIG_PROJECT_ID}/logs/InternalDataBaseError" OR "projects/${process.env.FIREBASE_CONFIG_PROJECT_ID}/logs/InternalServerError") severity:"ERROR" timestamp:"${date.toISOString()}"`;

            let googleLogEntries: GetEntriesResponse = (await logging.getEntries({
                filter: filterObject
            }).catch((err) => console.log(err)) as GetEntriesResponse);
            let resultLogEntries = googleLogEntries[0].map((entry: Entry) => (
                { logName: entry.metadata.logName, timestamp: entry.metadata.timestamp, id: entry.data.id, errorMessage: entry.data.errorMessage, errorStack: entry.data.errorStack }
            )) as any[];
            return resultLogEntries;
        }
        catch (fileError) {
            return Promise.reject(await this.writeErrorToLog(fileError).catch((err) => console.log(err)))
        }
    }
}

export { GoogleLoggingService }