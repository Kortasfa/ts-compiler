import { ErrorReason } from '../LLParser';

/**
 * Преобразует ошибку парсинга в строку
 * 
 * Эта функция форматирует информацию об ошибке парсинга в читаемое сообщение,
 * указывая, какие символы ожидались и какой символ был получен.
 * 
 * @param error Ошибка парсинга
 * @returns Строковое представление ошибки
 */
export function formatParsingError(error: ErrorReason): string {
  const expectedStr = Array.from(error.expected).join(', ');
  const receivedStr = error.received.value || `<${error.received.type}>`;
  
  return `Expected one of [${expectedStr}], but received ${receivedStr}`;
} 