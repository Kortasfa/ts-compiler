import { ErrorReason } from '../LLParser';

/**
 * Преобразует ошибку парсинга в строку
 * @param error Ошибка парсинга
 */
export function stringifyError(error: ErrorReason): string {
  const expectedStr = Array.from(error.expected).join(', ');
  const receivedStr = error.received.value || `<${error.received.type}>`;
  
  return `Expected one of [${expectedStr}], but received ${receivedStr}`;
} 