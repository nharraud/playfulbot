import { ValidationError } from "./Errors";

export type Validator = <T>(data: T) => Promise<ValidationError | null>;
