import { Reader } from '../reader/Reader';
import { TokenType } from '../token/Token';

/**
 * Карта специальных символов и соответствующих им типов токенов
 */
export const SPECIAL_CHARS: Map<string, TokenType> = new Map([
  ['(', TokenType.PARAN_OPEN],
  [')', TokenType.PARAN_CLOSE],
  ['{', TokenType.CURLY_OPEN],
  ['}', TokenType.CURLY_CLOSE],
  ['[', TokenType.BRACKET_OPEN],
  [']', TokenType.BRACKET_CLOSE],
  [',', TokenType.COMMA],
  ['+', TokenType.OP_PLUS],
  ['-', TokenType.OP_MINUS],
  ['*', TokenType.OP_MUL],
  ['/', TokenType.OP_DIVISION],
  ['=', TokenType.OP_ASSIGNMENT],
  ['!', TokenType.OP_NOT_MARK],
  ['<', TokenType.OP_LESS],
  ['>', TokenType.OP_GREATER],
]);

/**
 * Карта специальных двойных символов и соответствующих им типов токенов
 */
export const DOUBLED_SPECIAL_CHARS: Map<string, [string, TokenType]> = new Map([
  ['=', ['=', TokenType.OP_EQUAL]],
  ['!', ['=', TokenType.OP_NOT_EQUAL]],
  ['<', ['=', TokenType.OP_LESS_OR_EQUAL]],
  ['>', ['=', TokenType.OP_GREATER_OR_EQUAL]],
]);

/**
 * Проверяет, является ли символ специальным
 */
export function isSpecialChar(c: string): boolean {
  return SPECIAL_CHARS.has(c);
}

/**
 * Правило для обработки специальных символов
 */
export function specialCharRule(reader: Reader): TokenType {
  const char = reader.peek();
  const tokenType = SPECIAL_CHARS.get(char);

  if (!tokenType) {
    throw new Error(`Invalid special char: ${char}`);
  }

  reader.get();
  if (reader.empty()) {
    return tokenType;
  }

  const doubled = DOUBLED_SPECIAL_CHARS.get(char);
  if (!doubled || doubled[0] !== reader.peek()) {
    return tokenType;
  }

  reader.get();
  return doubled[1];
} 