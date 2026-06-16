export interface ITransactionManager {
  execute<T>(operation: (txClient: any) => Promise<T>): Promise<T>;
}