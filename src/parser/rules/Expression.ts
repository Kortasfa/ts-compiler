import { Parser } from '../Parser';
import { isRelOp } from './Operations';

/**
 * expressionRem -> e | relOp simexp expressionRem
 */
export function expressionRem(this: Parser): boolean {
  if (this.empty()) {
    return true;
  }

  if (isRelOp(this.peek())) {
    this.get();
    return this.simExp() && this.expressionRem();
  }

  return true;
}

/**
 * expression -> simexp expressionRem
 * expressionRem -> e | relOp simexp expressionRem
 */
export function expression(this: Parser): boolean {
  if (this.empty()) {
    return false;
  }

  return this.simExp() && this.expressionRem();
} 