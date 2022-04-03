import { Connection } from 'typeorm';
import { getConnection } from '../database_sql.utils';
import { FiledataRepository } from '../filedata.repository.interface';
import { Filedata } from '../../model/filedata.model';

class FiledataRepositorySQL implements FiledataRepository {
    addFiledata = async (newFiledata: Filedata): Promise<Filedata | undefined> => {
        let connection: Connection = getConnection(undefined);
        let filedataRepository = connection.getRepository(Filedata);
        return filedataRepository.save(newFiledata).then(async () => {
            return filedataRepository.findOne(newFiledata._id);
        })
    }

    updateFiledata = async (updateFiledata: Filedata): Promise<Filedata | undefined> => {
        let connection: Connection = getConnection(undefined);
        let filedataRepository = connection.getRepository(Filedata);
        return filedataRepository.save(updateFiledata).then(async () => {
            return filedataRepository.findOne(updateFiledata._id);
        })
    }

    getFiledata = async (id: string): Promise<Filedata | undefined> => {
        let connection: Connection = getConnection(undefined);
        let filedataRepository = connection.getRepository(Filedata);
        return filedataRepository.findOne(id);
    }

    getFiledataList = async (): Promise<Filedata[] | undefined> => {
        let connection: Connection = getConnection(undefined);
        let filedataRepository = connection.getRepository(Filedata);
        return filedataRepository.find();
    }

    deleteFiledata = async (id: string): Promise<Boolean> => {
        let connection: Connection = getConnection(undefined);
        let filedataRepository = connection.getRepository(Filedata);
        let filedata: Filedata | undefined = await filedataRepository.findOne(id);
        await filedataRepository.remove(filedata!);
        return Promise.resolve(true);
    }
}

export {FiledataRepositorySQL}