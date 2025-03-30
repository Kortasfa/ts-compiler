/**
 * Модуль для работы с таблицами синтаксического анализа
 *
 * Данный модуль содержит типы и функции для работы с таблицами
 * LL-парсера. Таблица синтаксического анализа - это ключевой компонент
 * предиктивного синтаксического анализатора, который определяет,
 * какое правило вывода должно быть применено в каждой точке разбора.
 */

/**
 * Константы для работы с таблицей
 * 
 * EMPTY - пустой символ в грамматике
 * NON_TERM_FIRST_CHAR - начальный символ для обозначения нетерминала
 * NON_TERM_MIN_SIZE - минимальный размер нетерминала
 */
export const EMPTY = "e";
export const NON_TERM_FIRST_CHAR = '<';
export const NON_TERM_MIN_SIZE = 3;

/**
 * Тип для представления направляющих множеств
 * 
 * Направляющее множество (Guides) - это набор терминальных символов,
 * которые могут появиться первыми в строке, выводимой из данного нетерминала.
 * Эти множества используются при построении таблицы синтаксического анализа
 * для определения, какое правило применять при встрече определенного токена.
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
 * 
 * TableRow представляет одну строку в таблице синтаксического анализа.
 * Каждая строка содержит:
 * - symbol: символ грамматики (терминал или нетерминал)
 * - guides: направляющее множество символов
 * - shift: флаг, указывающий, нужно ли сдвигать входной токен
 * - error: флаг, указывающий на наличие ошибки
 * - ptr: указатель на следующую строку таблицы (если есть)
 * - stack: флаг, указывающий, нужно ли добавить значение в стек
 * - end: флаг, указывающий на конец разбора
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
 * 
 * Table - это массив строк таблицы (TableRow), которые вместе
 * формируют таблицу синтаксического анализа для LL-парсера.
 * Таблица используется парсером для определения, какие правила
 * грамматики применять при анализе входной строки.
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