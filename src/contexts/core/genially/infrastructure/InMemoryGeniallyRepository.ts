import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";

export default class InMemoryGeniallyRepository implements GeniallyRepository {
  private static geniallys: Genially[] = [];
  private static analytics: {
    inventory: {
      geniallys: number;
    };
  } = { inventory: { geniallys: 0} }
  async save(genially: Genially): Promise<void> {
    await this.delete(genially.id);
    InMemoryGeniallyRepository.geniallys.push(genially);
  }

  async find(id: string): Promise<Genially> {
    return InMemoryGeniallyRepository.geniallys.find((genially) => genially.id === id);
  }

  async search(page: number, size: number): Promise<Genially[]> {
    if(size < 1) size = 1;
    if(page < 1) page = 1;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return InMemoryGeniallyRepository.geniallys.slice(startIndex, endIndex);
  }

  async delete(id: string): Promise<void> {
    InMemoryGeniallyRepository.geniallys = InMemoryGeniallyRepository.geniallys.filter((genially) => genially.id !== id);
  }

  increase(amount: number): void {
    InMemoryGeniallyRepository.analytics.inventory.geniallys += amount;
  }
}
