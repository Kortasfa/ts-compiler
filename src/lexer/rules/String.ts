import { Reader } from '../reader/Reader';

/**
 * Проверяет, является ли символ кавычкой
 */
export function isQuot(c: string): boolean {
  return c === '\'';
}

/**
 * Правило для обработки строковых литералов
 */
export function stringRule(reader: Reader): boolean {
  if (!isQuot(reader.get())) {
    return false;
  }

  if (reader.empty()) {
    return false;
  }

  while (!isQuot(reader.get())) {
    if (reader.empty()) {
      return false;
    }
  }

  return true;
} 