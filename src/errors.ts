export class MissingFieldValueError extends Error {
  constructor(fieldName: string) {
    super();
    this.message = `Missing value for field ${fieldName}`;
    this.name = "MissingFieldValueError";
  }
}

export class UninitializedError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
