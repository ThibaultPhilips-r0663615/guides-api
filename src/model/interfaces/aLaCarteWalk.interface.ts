import { Language } from '../language.model';
import { Filedata } from '../filedata.model';
import { Label } from '../label.model';
import { Address } from '../address.model';
import { Guide } from '../guide.model';

interface IALaCarteWalk {
    _id: string,
    titles: any[],
    descriptions: any[],
    pricePerPerson?: number,
    startLocation?: Address,
    endLocation?: Address,
    duration?: number;
    labels?: Label[];
    languages?: Language[],
    guides?: Guide[];
    banner: Filedata,
    images?: Filedata[]
}

export { IALaCarteWalk }