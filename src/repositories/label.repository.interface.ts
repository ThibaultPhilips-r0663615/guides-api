import { Label } from '../model/label.model';

interface LabelRepository {
    addLabel: (addLabel: Label) => Promise<Label | undefined>;
    updateLabel: (updateLabel: Label) => Promise<Label | undefined>;
    getLabel: (id: string) => Promise<Label | undefined>;
    getLabels: () => Promise<Label[] | undefined>;
    deleteLabel: (id: string) => Promise<Boolean>;
}

export {LabelRepository}