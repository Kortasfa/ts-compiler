import { Parser } from '../Parser';
import { isHighPriorityOp } from './Operations';

/**
 * simtermRem -> e | highPriorityOp term simtermRem
 */
export function simTermRem(this: Parser): boolean {
  if (this.empty()) {
    return true;
  }

  if (isHighPriorityOp(this.peek())) {
    this.get();
    return this.term() && this.simTermRem();
  }

  return true;
}

/**
 * simterm -> term simtermRem
 * simtermRem -> e | highPriorityOp term simtermRem
 */
export function simTerm(this: Parser): boolean {
  if (this.empty()) {
    return false;
  }

  return this.term() && this.simTermRem();
} 