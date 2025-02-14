import { validate as uuidValidate } from 'uuid';
import { version as uuidVersion } from 'uuid';

export function isUUIDv4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}