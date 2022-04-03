import { Language } from '../language.model';
import { Filedata } from '../filedata.model';

interface IGuide {
    _id: string,
    firstName: String,
    lastName: String,
    nickName?: String,
    email?: String,
    phoneNumber?: String,
    languages?: Language[],
    profilePicture: Filedata,
    images?: Filedata[]
}

export { IGuide }