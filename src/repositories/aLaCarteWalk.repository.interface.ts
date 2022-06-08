import { ALaCarteWalk } from '../model/aLaCarteWalk.mode';

interface IALaCarteWalkRepository {
    addALaCarteWalk: (addALaCarteWalk: ALaCarteWalk) => Promise<any | undefined>;
    updateALaCarteWalk: (updateALaCarteWalk: ALaCarteWalk) => Promise<ALaCarteWalk | undefined>;
    getALaCarteWalk: (id: string) => Promise<ALaCarteWalk | undefined>;
    getALaCarteWalks: () => Promise<ALaCarteWalk[] | undefined>;
    deleteALaCarteWalk: (id: string) => Promise<Boolean>;
}

export {IALaCarteWalkRepository}