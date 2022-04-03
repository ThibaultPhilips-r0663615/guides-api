import { Guide } from '../guide.model';

interface IFiledata {
    _id: string,
    fileName: String, 
    fileSize: number, 
    fileType: String, 
    fileDownloadUrl: String, 
    localUrl: String, 
    guides: Guide[]
}

export { IFiledata }