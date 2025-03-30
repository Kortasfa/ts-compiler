/**
 * Константы для работы с таблицей
 */
export const EMPTY = "e";
export const NON_TERM_FIRST_CHAR = '<';
export const NON_TERM_MIN_SIZE = 3;

/**
 * Тип для представления направляющих множеств
 */
export type Guides = Set<string>;

/**
 * Проверяет равенство двух направляющих множеств
 */
export function guidesEqual(a: Guides, b: Guides): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const element of a) {
    if (!b.has(element)) {
      return false;
    }
  }

  return true;
}

/**
 * Структура для представления строки таблицы
 */
export interface TableRow {
  symbol: string;
  guides: Guides;
  shift: boolean;
  error: boolean;
  ptr?: number;
  stack: boolean;
  end: boolean;
}

/**
 * Проверяет равенство двух строк таблицы
 */
export function tableRowEqual(a: TableRow, b: TableRow): boolean {
  return a.symbol === b.symbol &&
    guidesEqual(a.guides, b.guides) &&
    a.shift === b.shift &&
    a.error === b.error &&
    a.ptr === b.ptr &&
    a.stack === b.stack &&
    a.end === b.end;
}

/**
 * Тип для представления таблицы
 */
export type Table = TableRow[];

/**
 * Проверяет равенство двух таблиц
 */
export function tableEqual(a: Table, b: Table): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!tableRowEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Проверяет, является ли символ терминалом
 */
export function isTerm(term: string): boolean {
  return term.length < NON_TERM_MIN_SIZE || term[0] !== NON_TERM_FIRST_CHAR;
} 