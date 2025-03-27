/**
 * Создает строковое представление контейнера для вывода
 */
export function printContainer<T>(container: Iterable<T>): string {
  return Array.from(container).join(' ');
} 