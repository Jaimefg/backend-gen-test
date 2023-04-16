import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";
import GeniallyNotCreated from "../domain/GeniallyNotCreated";

type CreateGeniallyServiceRequest = {
  id: string;
  name: string;
  description: string;
};

export default class CreateGeniallyService {
  private readonly NAME_LENGTH = {
    MIN: 3,
    MAX: 20
  }
  private readonly DESCRIPTION_MAX_LENGTH = 125;
  constructor(private repository: GeniallyRepository) {}

  private validateRequest(req: CreateGeniallyServiceRequest): Error {
    const { name, description } = req;
    if(!name || name.length === 0) return new GeniallyNotCreated(name, "A name should be provided");
    if(name.length < this.NAME_LENGTH.MIN) return new GeniallyNotCreated(name, `Name should have at least ${this.NAME_LENGTH.MIN} characters`);
    if(name.length > this.NAME_LENGTH.MAX) return new GeniallyNotCreated(name, `Name should have a maximum of ${this.NAME_LENGTH.MAX} characters`);

    if(!description) return new GeniallyNotCreated(name, "Genially should have description");
    if(description.length > this.DESCRIPTION_MAX_LENGTH) return new GeniallyNotCreated(name, `Description should have a maximum of ${this.DESCRIPTION_MAX_LENGTH} characters`);
  }

  public async execute(req: CreateGeniallyServiceRequest): Promise<Genially|Error> {
    const { id, name, description } = req;
    const validationError = this.validateRequest(req);
    if(validationError) return validationError;

    const genially = new Genially(id, name, description);
    await this.repository.save(genially);
    await this.repository.increase(1);
    return genially;
  }
}
