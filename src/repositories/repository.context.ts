import { IAddressRepository } from "./address.repository.interface";
import { IFiledataRepository } from "./filedata.repository.interface";
import { IGuideRepository } from "./guide.repository.interface";
import { ILabelRepository } from "./label.repository.interface";
import { ILanguageRepository } from "./language.repository.interface";
import { IALaCarteWalkRepository } from "./aLaCarteWalk.repository.interface";
import { AddressRepositoryMongoDB } from "./mongodb/address.repository";
import { FiledataRepositoryMongoDB } from "./mongodb/filedata.repository";
import { GuideRepositoryMongoDB } from "./mongodb/guide.repository";
import { LabelRepositoryMongoDB } from "./mongodb/label.repository";
import { LanguageRepositoryMongoDB } from "./mongodb/language.repository";
import { ALaCarteWalkRepositoryMongoDB } from "./mongodb/aLaCarteWalk.repository";
import { AddressRepositorySQL } from "./sql/address.repository";
import { FiledataRepositorySQL } from "./sql/filedata.repository";
import { GuideRepositorySQL } from "./sql/guide.repository";
import { LabelRepositorySQL } from "./sql/label.repository";
import { LanguageRepositorySQL } from "./sql/language.repository";

class RepositoryContext {
    private static _Instance: RepositoryContext = new RepositoryContext();

    public addressRepository: IAddressRepository;
    public languageRepository: ILanguageRepository;
    public guideRepository: IGuideRepository;
    public labelRepository: ILabelRepository;
    public filedataRepository: IFiledataRepository;
    public aLaCarteWalkRepository: IALaCarteWalkRepository;

    constructor() {
        if (RepositoryContext._Instance) {
            throw new Error(`Error: Instantiation failed for ${RepositoryContext.name} : Use SingletonClass.getInstance() instead of new.`);
        }
        RepositoryContext._Instance = this;

        switch (process.env.DATABASE_ENV) {
            case 'SQL':
                this.addressRepository = new AddressRepositorySQL();
                this.languageRepository = new LanguageRepositorySQL();
                this.guideRepository = new GuideRepositorySQL();
                this.labelRepository = new LabelRepositorySQL();
                this.filedataRepository = new FiledataRepositorySQL();

                break;
            case 'MONGODB':
                this.addressRepository = new AddressRepositoryMongoDB();
                this.languageRepository = new LanguageRepositoryMongoDB();
                this.guideRepository = new GuideRepositoryMongoDB();
                this.labelRepository = new LabelRepositoryMongoDB();
                this.filedataRepository = new FiledataRepositoryMongoDB();
                this.aLaCarteWalkRepository = new ALaCarteWalkRepositoryMongoDB();
                break;
            default:
                this.addressRepository = new AddressRepositorySQL();
                this.languageRepository = new LanguageRepositorySQL();
                this.guideRepository = new GuideRepositorySQL();
                this.labelRepository = new LabelRepositorySQL();
                this.filedataRepository = new FiledataRepositorySQL();
                break;
        }
    }

    public static GetInstance(): RepositoryContext {
        return RepositoryContext._Instance;
    }
}

export { RepositoryContext }