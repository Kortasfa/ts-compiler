import { Parser } from '../Parser';
import { TokenType } from '../../lexer/token/Token';

/**
 * idRem -> e | [expression] idRem | (expList) idRem | () idRem
 */
export function idRem(this: Parser): boolean {
  if (this.empty()) {
    return true;
  }

  const nextTokenType = this.peek().type;

  if (nextTokenType === TokenType.BRACKET_OPEN) {
    this.get();
    return this.expression() && this.get().type === TokenType.BRACKET_CLOSE && this.idRem();
  }

  if (nextTokenType === TokenType.PARAN_OPEN) {
    this.get();
    if (this.peek().type === TokenType.PARAN_CLOSE) {
      this.get();
      return this.idRem();
    }
    return this.expressionList() && this.get().type === TokenType.PARAN_CLOSE && this.idRem();
  }

  return true;
}

/**
 * id -> ID
 */
export function id(this: Parser): boolean {
  return !this.empty() && this.get().type === TokenType.ID;
}

/**
 * ident -> id idRem
 * idRem -> e | [expression] idRem | (expList) idRem
 */
export function ident(this: Parser): boolean {
  return this.id() && this.idRem();
} 