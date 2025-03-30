import { Reader } from '../reader/Reader';

/**
 * Проверяет, является ли символ цифрой
 */
export function digit(c: string): boolean {
  return c >= '0' && c <= '9';
}

/**
 * Проверяет, является ли символ цифрой, отличной от нуля
 */
export function nonZero(c: string): boolean {
  return c > '0' && c <= '9';
}

/**
 * expRem -> e | digit expRem
 */
export function expRem(reader: Reader): boolean {
  if (reader.empty()) {
    return true;
  }

  if (digit(reader.peek())) {
    reader.get();
    return expRem(reader);
  }

  return true;
}

/**
 * expVal -> nonZero expRem
 */
export function expVal(reader: Reader): boolean {
  return !reader.empty() && nonZero(reader.get()) && expRem(reader);
}

/**
 * exp -> + expVal | - expVal
 */
export function exp(reader: Reader): boolean {
  if (reader.empty()) {
    return false;
  }

  const sign = reader.get();
  return (sign === '+' || sign === '-') && expVal(reader);
}

/**
 * expPart -> e | e exp | E exp
 */
export function expPart(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return true;
  }

  const ch = reader.peek();
  if (ch === 'e' || ch === 'E') {
    isInteger.value = false;
    reader.get();
    return exp(reader);
  }

  return true;
}

/**
 * mantissaRem -> e | digit mantissaRem
 */
export function mantissaRem(reader: Reader): boolean {
  if (reader.empty()) {
    return true;
  }

  if (digit(reader.peek())) {
    reader.get();
    return mantissaRem(reader);
  }

  return true;
}

/**
 * mantissa -> digit mantissaRem
 */
export function mantissa(reader: Reader): boolean {
  if (reader.empty()) {
    return false;
  }

  return digit(reader.get()) && mantissaRem(reader);
}

/**
 * optMantissa -> e | .mantissa
 */
export function optMantissa(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return true;
  }

  if (reader.peek() === '.') {
    isInteger.value = false;
    reader.get();
    return mantissa(reader);
  }

  return !digit(reader.peek());
}

/**
 * numberRem -> e | digit numberRem | .mantissa
 */
export function numberRem(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return true;
  }

  if (digit(reader.peek())) {
    reader.get();
    return numberRem(reader, isInteger);
  }

  if (reader.peek() === '.') {
    isInteger.value = false;
    reader.get();
    return mantissa(reader);
  }

  return true;
}

/**
 * num -> nonZero numberRem | 0 optMantissa
 */
export function num(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return false;
  }

  const ch = reader.peek();
  if (nonZero(ch)) {
    reader.get();
    return numberRem(reader, isInteger);
  }

  if (ch === '0') {
    reader.get();
    return optMantissa(reader, isInteger);
  }

  return false;
}

/**
 * number -> num expPart
 * num -> nonZero numberRem | 0 optMantissa
 * numberRem -> e | digit numberRem | .mantissa
 * optMantissa -> e | .mantissa
 * mantissa -> digit mantissaRem
 * mantissaRem -> e | digit mantissaRem
 * expPart -> e | e exp | E exp
 * exp -> + expVal | - expVal
 * expVal -> nonZero expRem
 * expRem -> e | digit expRem
 */
export function numberRule(reader: Reader, isInteger: { value: boolean }): boolean {
  isInteger.value = true;
  return num(reader, isInteger) && expPart(reader, isInteger);
} 