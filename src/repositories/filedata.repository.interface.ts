import { Filedata } from './../model/Filedata.model';

interface IFiledataRepository {
    addFiledata: (addFiledata: Filedata) => Promise<Filedata | undefined>;
    updateFiledata: (updateFiledata: Filedata) => Promise<Filedata | undefined>;
    getFiledata: (id: string) => Promise<Filedata | undefined>;
    getFiledataList: () => Promise<Filedata[] | undefined>;
    deleteFiledata: (id: string) => Promise<Boolean>;
}

export {IFiledataRepository}