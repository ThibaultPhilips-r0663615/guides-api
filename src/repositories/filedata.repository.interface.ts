import { Filedata } from './../model/Filedata.model';

interface FiledataRepository {
    addFiledata: (addFiledata: Filedata) => Promise<Filedata | undefined>;
    updateFiledata: (updateFiledata: Filedata) => Promise<Filedata | undefined>;
    getFiledata: (id: string) => Promise<Filedata | undefined>;
    getFiledataList: () => Promise<Filedata[] | undefined>;
    deleteFiledata: (id: string) => Promise<Boolean>;
}

export {FiledataRepository}