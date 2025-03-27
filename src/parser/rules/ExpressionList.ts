import { Parser } from '../Parser';
import { TokenType } from '../../lexer/token/Token';

/**
 * expListRemainder -> e | , expression expListRemainder
 */
export function expressionListRem(this: Parser): boolean {
  if (this.empty()) {
    return true;
  }

  if (this.peek().type === TokenType.COMMA) {
    this.get();
    return this.expression() && this.expressionListRem();
  }

  return true;
}

/**
 * expList -> expression expListRemainder
 * expListRemainder -> e | , expression expListRemainder
 */
export function expressionList(this: Parser): boolean {
  return this.expression() && this.expressionListRem();
} 