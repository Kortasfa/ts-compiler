import { Token, TokenType } from '../../lexer/token/Token';

/**
 * Набор операторов отношения
 */
export const REL_OPS: Set<TokenType> = new Set([
  TokenType.OP_EQUAL,
  TokenType.OP_NOT_EQUAL,
  TokenType.OP_GREATER,
  TokenType.OP_LESS,
  TokenType.OP_GREATER_OR_EQUAL,
  TokenType.OP_LESS_OR_EQUAL,
]);

/**
 * Набор операторов низкого приоритета
 */
export const LOW_PRIORITY_OPS: Set<TokenType> = new Set([
  TokenType.OP_PLUS,
  TokenType.OP_MINUS,
  TokenType.OP_OR,
]);

/**
 * Набор операторов высокого приоритета
 */
export const HIGH_PRIORITY_OPS: Set<TokenType> = new Set([
  TokenType.OP_MUL,
  TokenType.OP_DIVISION,
  TokenType.OP_DIV,
  TokenType.OP_MOD,
  TokenType.OP_AND,
]);

/**
 * Проверяет, является ли токен оператором отношения
 */
export function isRelOp(token: Token): boolean {
  return REL_OPS.has(token.type);
}

/**
 * Проверяет, является ли токен оператором низкого приоритета
 */
export function isLowPriorityOp(token: Token): boolean {
  return LOW_PRIORITY_OPS.has(token.type);
}

/**
 * Проверяет, является ли токен оператором высокого приоритета
 */
export function isHighPriorityOp(token: Token): boolean {
  return HIGH_PRIORITY_OPS.has(token.type);
} 