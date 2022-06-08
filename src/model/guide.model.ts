import { Filedata } from './filedata.model';
import { Column, PrimaryColumn, Entity, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Language } from './language.model';
import {
    Length,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    ArrayMaxSize,
    IsDefined
} from 'class-validator';
import { IGuide } from './interfaces/guide.interface';
import { ALaCarteWalk } from './aLaCarteWalk.model';

export class GuideBase {
    @IsNotEmpty({
        always: true,
        message: 'ID of a guide may not be empty'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    _id: string;

    @IsNotEmpty({
        always: true,
        message: 'First name of a guide may not be empty'
    })
    @Length(1, 50, {
        always: true,
        message: 'First name of a guide must be between 1 and 50 characters'
    })
    @Column({ type: 'varchar', length: 50 })
    firstName: String;

    @IsNotEmpty({
        always: true,
        message: 'Last name of a guide may not be empty'
    })
    @Length(1, 50, {
        always: true,
        message: 'Last name of a guide must be between 1 and 50 characters'
    })
    @Column({ type: 'varchar', length: 50 })
    lastName: String;

    @IsOptional()
    @Length(1, 50, {
        always: true,
        message: 'Nick name of a guide must be between 1 and 50 characters'
    })
    @Column({ type: 'varchar', length: 50 })
    nickName: String;

    @IsNotEmpty({
        always: true,
        message: 'Email of a guide may not be empty'
    })
    @Length(3, 100, {
        always: true,
        message: 'Email of a guide must be between 3 and 100 characters'
    })
    @IsEmail({}, {
        always: true,
        message: 'Email of a guide must be a valid email'
    })
    @Column({ type: 'varchar', length: 100 })
    email: String;

    @IsNotEmpty({
        always: true,
        message: 'Phone number of a guide may not be empty'
    })
    @Length(1, 20, {
        always: true,
        message: 'Phone number of a guide must be between 1 and 20 characters'
    })
    @Column({ type: 'varchar', length: 20 })
    phoneNumber: String;

    descriptions: any[];

    @ManyToMany(type => Language, language => language.guides)
    @JoinTable({
        name: "guide_languages", // table name for the junction table of this relation
        joinColumn: {
            name: "guide_id",
            referencedColumnName: "_id"
        },
        inverseJoinColumn: {
            name: "language_id",
            referencedColumnName: "_id"
        }
    })
    languages: any[];

    @ManyToMany(type => ALaCarteWalk, walk => walk.guides)
    aLaCarteWalks: ALaCarteWalk[];

    constructor(_id: string = '', firstName: string = '', lastName: string = '', nickName: string = '', email: string = '', phoneNumber: string = '', descriptions: any = {}, languages: Language[] = undefined as any) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickName = nickName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.descriptions = descriptions;
        this.languages = languages;
    }
}

@Entity('guides')
export class Guide extends GuideBase implements IGuide {
    @IsNotEmpty({
        always: true,
        message: 'Profile picture of a guide may not be empty'
    })
    @OneToOne(type => Filedata)
    @JoinColumn()
    @IsDefined()
    profilePicture: Filedata;

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

    constructor(_id: string = '', firstName: string = '', lastName: string = '', nickName: string = '', email: string = '', phoneNumber: string = '', languages: Language[] = undefined as any, profilePicture: Filedata = undefined as any, images: Filedata[] = undefined as any) {
        super(_id, firstName, lastName, nickName, email, phoneNumber, languages)
        this.profilePicture = profilePicture;
        this.images = images;
    }
}