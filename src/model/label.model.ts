import { Length, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from "typeorm";
import { ILabel } from './interfaces/label.interface';

@Entity('labels')
export class Label implements ILabel {
    @IsNotEmpty({
        always: true,
        message: 'ID of a label may not be empty'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    _id: string;

    @Length(7, 7, {
        always: true,
        message: 'Color code of a label must be 7 characters'
    })
    @IsNotEmpty({
        always: true,
        message: 'Color code of a label may not be empty'
    })
    @Column({ type: 'varchar', length: 7 })

    colorCode: string;
    
    @Length(7, 7, {
        always: true,
        message: 'Text color code of a label must be 7 characters'
    })
    @IsNotEmpty({
        always: true,
        message: 'Text color code of a label may not be empty'
    })
    @Column({ type: 'varchar', length: 7 })
    textColorCode: string;

    constructor(_id: string, colorCode: string, textColorCode: string) {
        this._id = _id;
        this.colorCode = colorCode;
        this.textColorCode = textColorCode;
    }
}