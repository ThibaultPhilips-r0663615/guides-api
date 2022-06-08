import {
    Length,
    IsNotEmpty,
    IsBoolean
} from 'class-validator';
import { Entity, Column, PrimaryColumn, ManyToMany } from "typeorm";
import { ALaCarteWalk } from './aLaCarteWalk.mode';
import { Guide } from './guide.model';
import { ILanguage } from './interfaces/language.interface';

@Entity('languages')
export class Language implements ILanguage {
    @IsNotEmpty({
        always: true,
        message: 'ID of a language may not be empty'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    _id: string;

    @Length(1, 50, {
        always: true,
        message: 'Locale of a language must be between 1 and 50'
    })
    @IsNotEmpty({
        always: true,
        message: 'Locale of a language may not be empty'
    })
    @Column({ type: 'text' })
    locale: string;

    @Length(1, 10, {
        always: true,
        message: 'Code of a language must be between 1 and 10'
    })
    @IsNotEmpty({
        always: true,
        message: 'Code of a language may not be empty'
    })
    @Column({ type: 'text' })
    languageCode: string;

    @IsBoolean({
        always: true,
        message: `Is main language option must be 'true' OR 'false'`
    })
    @IsNotEmpty({
        message: 'Is main language option may not be empty'
    })
    @Column({ type: 'bool' })
    isMainLanguage: boolean;

    @ManyToMany(type => Guide, guide => guide.languages)
    guides: Guide[];

    @ManyToMany(type => ALaCarteWalk, walk => walk.languages)
    aLaCarteWalks: ALaCarteWalk[];

    constructor(_id: string = '', locale: string = '', languageCode: string = '', isMainLanguage: boolean = false, guides: Guide[] = undefined as any) {
        this._id = _id;
        this.locale = locale;
        this.languageCode = languageCode;
        this.isMainLanguage = isMainLanguage;
        this.guides = guides;
    }
}