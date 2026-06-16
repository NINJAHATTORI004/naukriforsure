export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string | null,
    public passwordHash: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public updateName(newName: string): void {
    this.name = newName;
    this.updatedAt = new Date();
  }
}