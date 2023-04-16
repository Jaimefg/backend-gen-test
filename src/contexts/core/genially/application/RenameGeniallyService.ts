import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";
import GeniallyNotUpdated from "../domain/GeniallyNotUpdated";
import GeniallyNotExist from "../domain/GeniallyNotExist";

type RenameGeniallyServiceRequest = {
  id: string;
  name: string;
};
export default class RenameGeniallyService {
  constructor(private repository: GeniallyRepository) {
  }

  private validateRequest(req: RenameGeniallyServiceRequest): Error {
    const geniallyValidations = Genially.geniallyValidations;
    const { id, name } = req;
    if(!id) return new GeniallyNotExist(id);
    if(!name || name.length === 0) return new GeniallyNotUpdated(name, "A name should be provided");
    if(name.length < geniallyValidations.NAME_LENGTH.MIN) return new GeniallyNotUpdated(name, `Name should have at least ${geniallyValidations.NAME_LENGTH.MIN} characters`);
    if(name.length > geniallyValidations.NAME_LENGTH.MAX) return new GeniallyNotUpdated(name, `Name should have a maximum of ${geniallyValidations.NAME_LENGTH.MAX} characters`);
  }

  public async execute(req: RenameGeniallyServiceRequest): Promise<Genially|Error> {
    const { id, name } = req;
    const validationError = this.validateRequest(req);
    if(validationError) return validationError;

    const genially = await this.repository.find(id);
    if(!genially) return new GeniallyNotExist(id);
    genially.rename(name);
    this.repository.save(genially);

    return genially;
  }
}
