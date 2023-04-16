import Genially from "./Genially";

interface GeniallyRepository {
  save(genially: Genially): Promise<void>;

  find(id: string): Promise<Genially>;

  delete(id: string): Promise<void>;

  search(page: number, size: number): Promise<Genially[]>;

  increase(amount: number): void;
}

export default GeniallyRepository;
