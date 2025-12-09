
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export function uuidValidateV4(id: string) {
  return uuidValidate(id) && uuidVersion(id) === 4;
}