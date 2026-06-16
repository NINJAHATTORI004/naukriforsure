export interface IBaseRepository<T, IdType = string> {
  findById(id: IdType): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: IdType): Promise<void>;
  exists(id: IdType): Promise<boolean>;
}