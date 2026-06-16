export class UniversalProfileAggregate {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public firstName: string | null,
    public lastName: string | null,
    public headline: string | null,
    public preferences: any,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateHeadline(newHeadline: string) {
    if (newHeadline.length > 200) {
      throw new Error('Headline is too long');
    }
    this.headline = newHeadline;
    this.updateModified();
  }

  private updateModified() {
    this.updatedAt = new Date();
  }
}