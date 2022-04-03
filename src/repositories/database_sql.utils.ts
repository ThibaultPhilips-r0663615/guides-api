import { createConnection, getConnectionManager } from "typeorm";

const getConnection = (databaseName: string | undefined) => {
    const connectionManager = getConnectionManager();
    return connectionManager.get(databaseName);
}

const createDatabaseConnection = async(databaseOptions: any) => {
    return createConnection(databaseOptions as any);
}

export { getConnection, createDatabaseConnection };