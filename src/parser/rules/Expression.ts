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
 * Правила для разбора выражений
 * 
 * Грамматика для выражений:
 * expression -> simexp expressionRem
 * expressionRem -> e | relOp simexp expressionRem
 * 
 * Эти правила описывают выражения, которые могут состоять из:
 * - Простых выражений (simexp), таких как арифметические выражения
 * - Сравнений между простыми выражениями с использованием операторов отношения (relOp)
 * - Цепочек сравнений (a < b == c > d)
 * 
 * Примеры выражений:
 * - 1 + 2 (простое выражение)
 * - a < b (сравнение)
 * - x + y == z (сравнение арифметических выражений)
 * 
 * Это правило является корневым для синтаксического анализатора
 * и представляет собой начальную точку разбора входной строки.
 */
export function expression(this: Parser): boolean {
  if (this.empty()) {
    return false;
  }

  return this.simExp() && this.expressionRem();
} 