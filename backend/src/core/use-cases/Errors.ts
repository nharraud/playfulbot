export class ValidationError extends Error  {
  constructor(msg: string, errors?: Record<string, string>) {
    super(msg);
    this.validationErrors = errors;
  }
  validationErrors:  Record<string, string>;
}