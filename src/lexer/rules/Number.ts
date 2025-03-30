import { Reader } from '../reader/Reader';

/**
 * Проверяет, является ли символ цифрой
 */
export function isDigit(character: string): boolean {
  return character >= '0' && character <= '9';
}

/**
 * Проверяет, является ли символ цифрой, отличной от нуля
 */
export function isNonZero(character: string): boolean {
  return character > '0' && character <= '9';
}

/**
 * expRem -> e | digit expRem
 */
export function parseExponentRemainder(reader: Reader): boolean {
  if (reader.empty()) {
    return true;
  }

  if (isDigit(reader.peek())) {
    reader.get();
    return parseExponentRemainder(reader);
  }

  return true;
}

/**
 * expVal -> nonZero expRem
 */
export function parseExponentValue(reader: Reader): boolean {
  return !reader.empty() && isNonZero(reader.get()) && parseExponentRemainder(reader);
}

/**
 * exp -> + expVal | - expVal
 */
export function parseExponent(reader: Reader): boolean {
  if (reader.empty()) {
    return false;
  }

  const sign = reader.get();
  return (sign === '+' || sign === '-') && parseExponentValue(reader);
}

/**
 * expPart -> e | e exp | E exp
 */
export function parseExponentPart(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return true;
  }

  const ch = reader.peek();
  if (ch === 'e' || ch === 'E') {
    isInteger.value = false;
    reader.get();
    return parseExponent(reader);
  }

  return true;
}

/**
 * mantissaRem -> e | digit mantissaRem
 */
export function parseMantissaRemainder(reader: Reader): boolean {
  if (reader.empty()) {
    return true;
  }

  if (isDigit(reader.peek())) {
    reader.get();
    return parseMantissaRemainder(reader);
  }

  return true;
}

/**
 * mantissa -> digit mantissaRem
 */
export function parseMantissa(reader: Reader): boolean {
  if (reader.empty()) {
    return false;
  }

  return isDigit(reader.get()) && parseMantissaRemainder(reader);
}

/**
 * optMantissa -> e | .mantissa
 */
export function parseOptionalMantissa(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return true;
  }

  if (reader.peek() === '.') {
    isInteger.value = false;
    reader.get();
    return parseMantissa(reader);
  }

  return !isDigit(reader.peek());
}

/**
 * numberRem -> e | digit numberRem | .mantissa
 */
export function parseNumberRemainder(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return true;
  }

  if (isDigit(reader.peek())) {
    reader.get();
    return parseNumberRemainder(reader, isInteger);
  }

  if (reader.peek() === '.') {
    isInteger.value = false;
    reader.get();
    return parseMantissa(reader);
  }

  return true;
}

/**
 * num -> nonZero numberRem | 0 optMantissa
 */
export function parseNum(reader: Reader, isInteger: { value: boolean }): boolean {
  if (reader.empty()) {
    return false;
  }

  const ch = reader.peek();
  if (isNonZero(ch)) {
    reader.get();
    return parseNumberRemainder(reader, isInteger);
  }

  if (ch === '0') {
    reader.get();
    return parseOptionalMantissa(reader, isInteger);
  }

  return false;
}

/**
 * Правила распознавания числовых литералов
 * 
 * Грамматика для чисел:
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
 * 
 * Данная грамматика позволяет распознавать:
 * - Целые числа: 0, 123, 456
 * - Числа с плавающей точкой: 0.5, 123.456
 * - Числа с экспонентой: 1e10, 2.5E-3
 * 
 * Параметр isInteger используется для передачи информации о том,
 * является ли распознанное число целым или с плавающей точкой.
 * Это важно для правильного определения типа токена.
 */
export function parseNumber(reader: Reader, isInteger: { value: boolean }): boolean {
  isInteger.value = true;
  return parseNum(reader, isInteger) && parseExponentPart(reader, isInteger);
} 