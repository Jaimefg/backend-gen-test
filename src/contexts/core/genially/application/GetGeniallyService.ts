import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

type GetListGeniallyServiceRequest = {
    id?: string;
    size?: number;
    page?: number;
}

export default class GetGeniallyService {
    private readonly NAME_LENGTH = {
        MIN: 3,
        MAX: 20
    }
    private readonly DESCRIPTION_MAX_LENGTH = 125;
    constructor(private repository: GeniallyRepository) {}

    public async execute(req: GetListGeniallyServiceRequest): Promise<Genially[]|Error> {
        const { size, page } = req;

        return this.repository.search(page, size);
    }
}
