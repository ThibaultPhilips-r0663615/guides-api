import { Label } from './../../model/label.model';
import { Connection } from "typeorm";
import { LabelRepository } from "../label.repository.interface";
import { getConnection } from '../database_sql.utils';

class LabelRepositorySQL implements LabelRepository {
    addLabel = async (newLabel: Label): Promise<Label | undefined> => {
        let connection: Connection = getConnection(undefined);
        let labelRepository = connection.getRepository(Label);
        return labelRepository.save(newLabel).then(async () => {
            return labelRepository.findOne(newLabel._id);
        })
    }

    updateLabel = async (updateLabel: Label): Promise<Label | undefined> => {
        let connection: Connection = getConnection(undefined);
        let labelRepository = connection.getRepository(Label);
        return labelRepository.save(updateLabel).then(async () => {
            return labelRepository.findOne(updateLabel._id);
        })
    }

    getLabel = async (id: string): Promise<Label | undefined> => {
        let connection: Connection = getConnection(undefined);
        let labelRepository = connection.getRepository(Label);
        return labelRepository.findOne(id);
    }

    getLabels = async (): Promise<Label[] | undefined> => {
        let connection: Connection = getConnection(undefined);
        let labelRepository = connection.getRepository(Label);
        return labelRepository.find();
    }

    deleteLabel = async (id: string): Promise<Boolean> => {
        let connection: Connection = getConnection(undefined);
        let labelRepository = connection.getRepository(Label);
        let label: Label | undefined = await labelRepository.findOne(id);
        await labelRepository.remove(label!);
        return Promise.resolve(true);
    }
}

export { LabelRepositorySQL }