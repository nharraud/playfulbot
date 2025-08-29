import { validate as uuidValidate } from 'uuid';

export function isUUID(uuid: string) {
  return uuidValidate(uuid);
}