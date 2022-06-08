import { Guide } from "../model/guide.model";

interface IGuideRepository {
    addGuide: (addGuide: Guide) => Promise<any | undefined>;
    updateGuide: (updateGuide: Guide) => Promise<Guide | undefined>;
    getGuide: (id: string) => Promise<Guide | undefined>;
    getGuides: () => Promise<Guide[] | undefined>;
    deleteGuide: (id: string) => Promise<Boolean>;
}

export {IGuideRepository}