import { Error } from '../../errors/Error';

/**
 * TokenType - перечисление типов токенов
 * 
 * Содержит все возможные типы токенов, которые может распознать лексический анализатор.
 * Включает специальные символы, операторы, идентификаторы, числовые литералы и ключевые слова.
 * Каждый токен имеет уникальный тип, который определяет его семантику в языке.
 */
export enum TokenType {
  ERROR,
  PARAN_OPEN, // (
  PARAN_CLOSE, // )
  CURLY_OPEN, // {
  CURLY_CLOSE, // }
  BRACKET_OPEN, // [
  BRACKET_CLOSE, // ]
  COMMA, // ,
  OP_PLUS, // +
  OP_MINUS, // -
  OP_MUL, // *
  OP_MOD, // mod
  OP_DIV, // div
  OP_DIVISION, // /
  OP_ASSIGNMENT, // =
  OP_EQUAL, // ==
  OP_NOT_EQUAL, // !=
  OP_LESS, // <
  OP_GREATER, // >
  OP_LESS_OR_EQUAL, // <=
  OP_GREATER_OR_EQUAL, // >=
  OP_AND, // and
  OP_OR, // or
  OP_NOT, // not
  OP_NOT_MARK, // !
  ID, // identifier
  INTEGER, // integer
  FLOAT, // float
  STRING_LITERAL, // string literal
  TRUE, // true
  FALSE, // false
}

/**
 * Token - интерфейс для представления токена
 * 
 * Представляет лексему, распознанную лексическим анализатором.
 * Токен содержит следующую информацию:
 * - type: тип токена из перечисления TokenType
 * - value: текстовое значение токена
 * - pos: позиция токена во входной строке
 * - error: код ошибки, если при обработке токена возникла ошибка
 * 
 * Токены являются основной единицей информации, передаваемой
 * от лексического анализатора к синтаксическому.
 */
export interface Token {
  type: TokenType;
  value: string;
  pos: number;
  error: Error;
} 