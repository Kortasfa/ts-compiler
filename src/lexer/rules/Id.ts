import { Reader } from '../reader/Reader';

/**
 * Проверяет, является ли символ допустимым для идентификатора
 */
export function isIdChar(ch: string): boolean {
  return ch === '_' || ch === '$' || /[a-zA-Z]/.test(ch);
}

/**
 * idChar -> _ | $ | letter
 */
export function idChar(reader: Reader): boolean {
  return isIdChar(reader.get());
}

/**
 * idPart -> idChar | digit
 */
export function idPart(reader: Reader): boolean {
  try {
    if (idChar(reader)) {
      return true;
    }
    reader.unget();

    return /[0-9]/.test(reader.get());
  } catch (e) {
    return false;
  }
}

/**
 * simpleIdRemainder -> e | idPart simpleIdRemainder
 */
export function simpleIdRemainder(reader: Reader): boolean {
  if (reader.empty()) {
    return true;
  }

  const count = reader.count();
  if (!idPart(reader)) {
    reader.seek(count);
    return true;
  }

  return simpleIdRemainder(reader);
}

/**
 * simpleId -> idChar simpleIdRemainder
 */
export function simpleId(reader: Reader): boolean {
  if (reader.empty()) {
    return false;
  }

  return idChar(reader) && simpleIdRemainder(reader);
}

/**
 * idRemainder -> e | .id
 */
export function idRemainder(reader: Reader): boolean {
  if (reader.empty()) {
    return true;
  }

  if (reader.peek() === '.') {
    reader.get();
    return idRule(reader);
  }

  return true;
}

/**
 * id -> simpleId idRemainder
 * idRemainder -> e | .id
 * simpleId -> idChar simpleIdRemainder
 * simpleIdRemainder -> e | idPart simpleIdRemainder
 * idPart -> idChar | digit
 * idChar -> _ | $ | letter
 */
export function idRule(reader: Reader): boolean {
  return simpleId(reader) && idRemainder(reader);
} 