/**
 * Error - перечисление кодов ошибок компилятора
 * 
 * Содержит все возможные коды ошибок, которые могут возникнуть
 * на разных этапах компиляции: лексическом анализе, синтаксическом
 * анализе и т.д.
 * 
 * Каждый код ошибки соответствует определенной проблеме,
 * которая может возникнуть при обработке исходного кода.
 * 
 * NONE - отсутствие ошибки
 * UNKNOWN_SYMBOL - неизвестный символ
 * INVALID_NUMBER - неверный формат числа
 * STRING_LITERAL_INCOMPLETE - незавершенный строковый литерал
 * EMPTY_INPUT - пустой ввод
 * INVALID_ID - неверный формат идентификатора
 * TERM_EXPECTED - ожидался терм
 * PARAN_CLOSE_EXPECTED - ожидалась закрывающая скобка
 */
export enum Error {
  NONE,
  UNKNOWN_SYMBOL,
  INVALID_NUMBER,
  STRING_LITERAL_INCOMPLETE,
  EMPTY_INPUT,
  INVALID_ID,
  TERM_EXPECTED,
  PARAN_CLOSE_EXPECTED,
} 