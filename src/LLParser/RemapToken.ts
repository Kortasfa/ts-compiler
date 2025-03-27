import { TokenType } from '../lexer/token/Token';

/**
 * Карта для преобразования типа токена в строку
 */
export const TokenTypeToString: Map<TokenType, string> = new Map([
  [TokenType.ERROR, "error"],
  [TokenType.PARAN_OPEN, "("],
  [TokenType.PARAN_CLOSE, ")"],
  [TokenType.CURLY_OPEN, "{"],
  [TokenType.CURLY_CLOSE, "}"],
  [TokenType.BRACKET_OPEN, "["],
  [TokenType.BRACKET_CLOSE, "]"],
  [TokenType.COMMA, ","],
  [TokenType.OP_PLUS, "+"],
  [TokenType.OP_MINUS, "-"],
  [TokenType.OP_MUL, "*"],
  [TokenType.OP_MOD, "mod"],
  [TokenType.OP_DIV, "div"],
  [TokenType.OP_DIVISION, "/"],
  [TokenType.OP_ASSIGNMENT, "="],
  [TokenType.OP_EQUAL, "=="],
  [TokenType.OP_NOT_EQUAL, "!="],
  [TokenType.OP_LESS, "<"],
  [TokenType.OP_GREATER, ">"],
  [TokenType.OP_LESS_OR_EQUAL, "<="],
  [TokenType.OP_GREATER_OR_EQUAL, ">="],
  [TokenType.OP_AND, "and"],
  [TokenType.OP_OR, "or"],
  [TokenType.OP_NOT, "not"],
  [TokenType.OP_NOT_MARK, "!"],
  [TokenType.ID, "id"],
  [TokenType.INTEGER, "int"],
  [TokenType.FLOAT, "float"],
  [TokenType.STRING_LITERAL, "string"],
  [TokenType.TRUE, "true"],
  [TokenType.FALSE, "false"],
]);

/**
 * Преобразует тип токена в строку
 * @param type Тип токена
 */
export function remapTokenTypeToString(type: TokenType): string {
  const result = TokenTypeToString.get(type);
  if (result === undefined) {
    throw new Error(`Unknown token type: ${type}`);
  }
  return result;
} 