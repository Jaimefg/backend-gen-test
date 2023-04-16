import Genially from "../domain/Genially";
import GeniallyNotExist from "../domain/GeniallyNotExist";
import GeniallyRepository from "../domain/GeniallyRepository";

type DeleteGeniallyServiceRequest = {
  id: string;
};

export default class DeleteGeniallyService {
  constructor(private repository: GeniallyRepository) {
  }
  private validateRequest(req: DeleteGeniallyServiceRequest) {
    const { id } = req;
    if(!id || id.length === 0) return new GeniallyNotExist(id);
  }
  public async execute(req: DeleteGeniallyServiceRequest): Promise<Genially|Error> {
    const{ id } = req;
    const validationError = this.validateRequest(req);
    if(validationError) return validationError;

    const genially = await this.repository.find(id);
    if(!genially) return new GeniallyNotExist(id);
    genially.delete();
    await this.repository.save(genially);
    return undefined;
  }
}
