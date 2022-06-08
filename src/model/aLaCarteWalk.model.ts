import { Filedata } from './filedata.model';
import { PrimaryColumn, Entity, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Language } from './language.model';
import {
    IsNotEmpty,
    ArrayMaxSize,
    IsDefined,
    Min,
    Max
} from 'class-validator';
import { IALaCarteWalk } from './interfaces/aLaCarteWalk.interface';
import { Guide } from './guide.model';
import { Label } from './label.model';
import { Address } from './address.model';

export class WalkBase {
    @IsNotEmpty({
        always: true,
        message: 'ID of a a la carte walk may not be empty'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    _id: string;

    titles: any[];
    descriptions: any[];

    @Min(0, {
        message: 'Price per person must be between 0 and 100.'
    })
    @Max(100, {
        message: 'Price per person must be between 0 and 100.'
    })
    pricePerPerson: number;

    @OneToOne(() => Address)
    @JoinColumn()
    startLocation: Address;

    @OneToOne(() => Address)
    @JoinColumn()
    endLocation: Address;

    @Min(0, {
        message: 'Duration must be between 0 and 1440.'
    })
    @Max(1440, {
        message: 'Duration must be between 0 and 1440.'
    })
    duration: number;

    @ManyToMany(type => Label, label => label.aLaCarteWalks)
    @JoinTable({
        name: "aLaCarteWalk_labels", // table name for the junction table of this relation
        joinColumn: {
            name: "aLaCarteWalk_id",
            referencedColumnName: "_id"
        },
        inverseJoinColumn: {
            name: "label_id",
            referencedColumnName: "_id"
        }
    })
    labels: any[];

    @ManyToMany(type => Language, language => language.aLaCarteWalks)
    @JoinTable({
        name: "aLaCarteWalk_languages", // table name for the junction table of this relation
        joinColumn: {
            name: "aLaCarteWalk_id",
            referencedColumnName: "_id"
        },
        inverseJoinColumn: {
            name: "language_id",
            referencedColumnName: "_id"
        }
    })
    languages: any[];

    @ManyToMany(type => Guide, guide => guide.aLaCarteWalks)
    @JoinTable({
        name: "aLaCarteWalk_guides", // table name for the junction table of this relation
        joinColumn: {
            name: "aLaCarteWalk_id",
            referencedColumnName: "_id"
        },
        inverseJoinColumn: {
            name: "guide_id",
            referencedColumnName: "_id"
        }
    })
    guides: any[];

    constructor(_id: string = '', titles: any = {}, descriptions: any = {}, pricePerPerson: number = 0, startLocation: Address = undefined as any, endLocation: Address = undefined as any, duration: number = 0, labels: Label[] = undefined as any, languages: Language[] = undefined as any, guides: Guide[] = undefined as any) {
        this._id = _id;
        this.titles = titles;
        this.descriptions = descriptions;
        this.pricePerPerson = pricePerPerson;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.duration = duration;
        this.labels = labels;
        this.languages = languages;
        this.guides = guides;
    }
}

@Entity('guides')
export class ALaCarteWalk extends WalkBase implements IALaCarteWalk {
    @IsNotEmpty({
        always: true,
        message: 'Profile picture of a guide may not be empty'
    })
    @OneToOne(type => Filedata)
    @JoinColumn()
    @IsDefined()
    banner: Filedata;

    @ArrayMaxSize(5, {
        always: true,
        message: 'Only a maximum of 5 images of a guide may be added.'
    })
    @ManyToMany(type => Filedata, image => image.guides)
    @JoinTable({
        name: "guide_images", // table name for the junction table of this relation
        joinColumn: {
            name: "guide_id",
            referencedColumnName: "_id"
        },
        inverseJoinColumn: {
            name: "filedata_id",
            referencedColumnName: "_id"
        }
    })
    images: Filedata[];

    constructor(_id: string = '', titles: any = {}, descriptions: any = {}, pricePerPerson: number = 0, startLocation: Address = undefined as any, endLocation: Address = undefined as any, duration: number = 0, labels: Label[] = undefined as any, languages: Language[] = undefined as any, guides: Guide[] = undefined as any, banner: Filedata = undefined as any, images: Filedata[] = undefined as any) {
        super(_id, titles, descriptions, pricePerPerson, startLocation, endLocation, duration, labels, languages, guides)
        this.banner = banner;
        this.images = images;
    }
}