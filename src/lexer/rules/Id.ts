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
export function parseIdChar(reader: Reader): boolean {
  return isIdChar(reader.getNextChar());
}

/**
 * idPart -> idChar | digit
 */
export function parseIdPart(reader: Reader): boolean {
  try {
    if (parseIdChar(reader)) {
      return true;
    }
    reader.unget();

    return /[0-9]/.test(reader.getNextChar());
  } catch (e) {
    return false;
  }
}

/**
 * simpleIdRemainder -> e | idPart simpleIdRemainder
 */
export function parseSimpleIdRemainder(reader: Reader): boolean {
  if (reader.isAtEnd()) {
    return true;
  }

  const count = reader.getCurrentPosition();
  if (!parseIdPart(reader)) {
    reader.seek(count);
    return true;
  }

  return parseSimpleIdRemainder(reader);
}

/**
 * simpleId -> idChar simpleIdRemainder
 */
export function parseSimpleId(reader: Reader): boolean {
  if (reader.isAtEnd()) {
    return false;
  }

  return parseIdChar(reader) && parseSimpleIdRemainder(reader);
}

/**
 * idRemainder -> e | .id
 */
export function parseIdRemainder(reader: Reader): boolean {
  if (reader.isAtEnd()) {
    return true;
  }

  if (reader.peekChar() === '.') {
    reader.getNextChar();
    return parseIdentifier(reader);
  }

  return true;
}

/**
 * Правила распознавания идентификаторов
 * 
 * Грамматика для идентификаторов:
 * id -> simpleId idRemainder
 * idRemainder -> e | .id
 * simpleId -> idChar simpleIdRemainder
 * simpleIdRemainder -> e | idPart simpleIdRemainder
 * idPart -> idChar | digit
 * idChar -> _ | $ | letter
 * 
 * Данная грамматика позволяет распознавать:
 * - Простые идентификаторы: name, _value, $price
 * - Идентификаторы с точкой: object.property, a.b.c
 * - Идентификаторы с цифрами: user1, item2
 * 
 * Идентификатор должен начинаться с буквы, символа подчеркивания или доллара,
 * и может содержать буквы, цифры, символы подчеркивания и доллара.
 */
export function parseIdentifier(reader: Reader): boolean {
  return parseSimpleId(reader) && parseIdRemainder(reader);
} 