import { Connection } from "typeorm";
import { Guide } from "../../model/guide.model";
import { GuideRepository } from "../guide.repository.interface";
import { getConnection } from '../database_sql.utils';

class GuideRepositorySQL implements GuideRepository {
    addGuide = async (newGuide: Guide): Promise<Guide | undefined> => {
        let connection: Connection = getConnection(undefined);
        let guideRepository = connection.getRepository(Guide);
        return guideRepository.save(newGuide).then(async () => {
            return guideRepository.findOne(newGuide._id);
        })
    }

    updateGuide = async (updateGuide: Guide): Promise<Guide | undefined> => {
        let connection: Connection = getConnection(undefined);
        let guideRepository = connection.getRepository(Guide);
        return guideRepository.save(updateGuide).then(async () => {
            return guideRepository.findOne(updateGuide._id);
        })
    }

    getGuide = async (id: string): Promise<Guide | undefined> => {
        let connection: Connection = getConnection(undefined);
        let guideRepository = connection.getRepository(Guide);
        return guideRepository.findOne(id);
    }

    getGuides = async (): Promise<Guide[] | undefined> => {
        let connection: Connection = getConnection(undefined);
        let guideRepository = connection.getRepository(Guide);
        return guideRepository.find();
    }

    deleteGuide = async (id: string): Promise<Boolean> => {
        let connection: Connection = getConnection(undefined);
        let guideRepository = connection.getRepository(Guide);
        let guide: Guide | undefined = await guideRepository.findOne(id);
        await guideRepository.remove(guide!);
        return Promise.resolve(true);
    }
}

export {GuideRepositorySQL}