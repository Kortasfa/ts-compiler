import { Parser } from '../Parser';
import { Error } from '../../errors/Error';
import { TokenType } from '../../lexer/token/Token';

/**
 * term -> (expression) | + term | - term | not term | ! term | ident | number | true | false | string
 */
export function term(this: Parser): boolean {
  if (this.empty()) {
    return false;
  }

  if (this.peek().type === TokenType.ID) {
    return this.ident();
  }

  const tokenType = this.get().type;

  if (tokenType === TokenType.PARAN_OPEN) {
    return this.expression() && ((!this.empty() && this.get().type === TokenType.PARAN_CLOSE) || this.panic(Error.PARAN_CLOSE_EXPECTED));
  }

  if (tokenType === TokenType.OP_PLUS
      || tokenType === TokenType.OP_MINUS
      || tokenType === TokenType.OP_NOT
      || tokenType === TokenType.OP_NOT_MARK) {
    return this.term();
  }

  if (tokenType === TokenType.INTEGER
      || tokenType === TokenType.FLOAT
      || tokenType === TokenType.TRUE
      || tokenType === TokenType.FALSE
      || tokenType === TokenType.STRING_LITERAL) {
    return true;
  }

  return this.panic(Error.TERM_EXPECTED);
} 