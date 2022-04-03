import { Schema } from 'mongoose';

/*interface FileData {
    _id: String;
    fileName: String;
    fileSize: Number;
    fileDownloadUrl: String;
    localUrl: String;
    guide?: String;
}*/

export const FileDataSchema = new Schema({    
    _id: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileDownloadUrl: {
        type: String,
        required: true
    },
    localUrl: {
        type: String,
        required: true
    },
    guide: {
        type: String,
        ref: 'guides'
    }
}, {
    collection: 'filedata'
})