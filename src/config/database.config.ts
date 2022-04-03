import { Filedata } from '../model/filedata.model';
import { Address } from '../model/address.model';
import { Label } from '../model/label.model';
import { Language } from '../model/language.model';
import { Guide } from '../model/guide.model';

export let SQL_DATABASE_CONFIG = {
    type: "mysql",
    host: `${process.env.SQL_DATABASE_HOST}`,
    port: `${process.env.SQL_DATABASE_PORT}`,
    username: `${process.env.SQL_DATABASE_USERNAME}`,
    password: `${process.env.SQL_DATABASE_PASSWORD}`,
    database: `${process.env.SQL_DATABASE_DB_NAME}`,
    entities: [
        Language,
        Filedata,
        Address,
        Label,
        Guide
    ],
    synchronize: true,
    dropSchema: true
}