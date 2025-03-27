import { Parser } from '../Parser';
import { isLowPriorityOp } from './Operations';

/**
 * simexpRem -> e | lowPriorityOp simterm simexpRem
 */
export function simExpRem(this: Parser): boolean {
  if (this.empty()) {
    return true;
  }

  if (isLowPriorityOp(this.peek())) {
    this.get();
    return this.simTerm() && this.simExpRem();
  }

  return true;
}

/**
 * simexp -> simterm simexpRem
 * simexpRem -> e | lowPriorityOp simterm simexpRem
 */
export function simExp(this: Parser): boolean {
  if (this.empty()) {
    return false;
  }

  return this.simTerm() && this.simExpRem();
} 