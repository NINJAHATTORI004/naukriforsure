export class CreateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly headline: string,
  ) {}
}