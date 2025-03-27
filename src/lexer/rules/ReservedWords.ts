import { Token, TokenType } from '../token/Token';

/**
 * Карта зарезервированных слов и соответствующих им типов токенов
 */
export const RESERVED_WORDS: Map<string, TokenType> = new Map([
  ['mod', TokenType.OP_MOD],
  ['div', TokenType.OP_DIV],
  ['and', TokenType.OP_AND],
  ['or', TokenType.OP_OR],
  ['not', TokenType.OP_NOT],
  ['true', TokenType.TRUE],
  ['false', TokenType.FALSE],
]);

/**
 * Преобразует строку в нижний регистр
 */
export function toLower(s: string): string {
  return s.toLowerCase();
}

/**
 * Проверяет, является ли токен зарезервированным словом
 */
export function checkReserved(token: Token): Token {
  const reservedType = RESERVED_WORDS.get(toLower(token.value));
  
  if (reservedType === undefined) {
    return token;
  }
  
  return {
    type: reservedType,
    value: token.value,
    pos: token.pos,
    error: token.error,
  };
} 