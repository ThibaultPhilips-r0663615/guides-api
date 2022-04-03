import {
    Length,
    IsNotEmpty,
    IsUrl,
    IsIn,
    Max
} from 'class-validator';
import { fileTypes } from './filetypes';
import { PrimaryColumn, Column, Entity, ManyToMany } from 'typeorm';
import { Guide } from './guide.model';
import { IFiledata } from './interfaces/filedata.interface';

@Entity('filedata')
export class Filedata implements IFiledata {
    @IsNotEmpty({
        always: true,
        message: 'ID of a guide may not be empty'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    _id: string;

    @IsNotEmpty({
        always: true,
        message: 'File name of the file data may not be empty.'
    })
    @Length(1, 100, {
        always: true,
        message: 'File name of the file data must be between 1 and 100 characters'
    })
    @Column({ type: 'varchar', length: 100 })
    fileName: String;

    @IsNotEmpty({
        always: true,
        message: 'File size of the file data may not be empty.'
    })
    @Max(10000000, {
        always: true,
        message: 'File size of the file data must be between 0 and 10MB.'
    })
    @Column({ type: 'integer' })
    fileSize: number;

    @IsNotEmpty({
        always: true,
        message: 'File type of the file data may not be empty.'
    })
    @IsIn(fileTypes, {
        always: true,
        message: 'File type of the file data is not a supported extention.'
    })
    @Length(1, 100, {
        always: true,
        message: 'File type of the file data must be between 1 and 100 characters'
    })
    @Column({ type: 'varchar', length: 100 })
    fileType: String;

    @IsNotEmpty({
        always: true,
        message: 'File download url of the file data may not be empty.'
    })
    @Length(1, 200, {
        always: true,
        message: 'File download url of the field data must be between 3 and 200 characters.'
    })
    @IsUrl({}, {
        always: true,
        message: 'File download url of the field data must be a valid url.'
    })
    @Column({ type: 'varchar', length: 200 })
    fileDownloadUrl: String;

    @IsNotEmpty({
        always: true,
        message: 'Local url of the file data may not be empty.'
    })
    @Length(1, 200, {
        always: true,
        message: 'Local url of the field data must be between 3 and 200 characters.'
    })
    @IsUrl({}, {
        always: true,
        message: 'Local url of the field data must be a valid url.'
    })
    @Column({ type: 'varchar', length: 200 })
    localUrl: String;

    @ManyToMany(type => Guide, guide => guide.images)
    guides: Guide[];

    constructor(_id: string = '', fileName: string = '', fileSize: number = 0, fileType: string = '', fileDownloadUrl: string = '', localUrl: string = '', guides: Guide[] = undefined as any) {
        this._id = _id;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.fileDownloadUrl = fileDownloadUrl;
        this.localUrl = localUrl;
        this.guides = guides;
    }
}