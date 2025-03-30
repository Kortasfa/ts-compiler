import { Error } from '../errors/Error';
import { Lexer } from '../lexer/Lexer';
import { Token, TokenType } from '../lexer/token/Token';
import { Guides, Table, TableRow } from '../table/Table';
import { remapTokenTypeToString } from './RemapToken';

/**
 * Константа для обозначения конца входной строки
 */
export const END_SYMBOL = "#";

/**
 * Структура для представления ошибки при парсинге
 * 
 * ErrorReason содержит информацию об ошибке, которая возникла
 * во время синтаксического анализа:
 * - expected: направляющее множество (Guides), содержащее символы,
 *   которые парсер ожидал встретить в данной точке анализа
 * - received: токен (Token), который был получен и вызвал ошибку
 * 
 * Эта информация используется для формирования понятных сообщений
 * об ошибках для пользователя.
 */
export interface ErrorReason {
  expected: Guides;
  received: Token;
}

/**
 * LL-парсер для синтаксического анализа
 * 
 * LL-парсер - это восходящий синтаксический анализатор, который
 * читает входную строку слева направо (L) и применяет самый левый
 * вывод (L) в обратном порядке.
 * 
 * Основные компоненты:
 * 1. Лексический анализатор (Lexer) для получения токенов
 * 2. Таблица (Table) для определения правил разбора
 * 3. Стек для хранения состояний парсера
 * 
 * Процесс работы:
 * 1. Чтение токенов из входной строки
 * 2. Использование таблицы для принятия решений о правилах разбора
 * 3. Применение правил разбора согласно таблице
 * 4. Обработка ошибок при несоответствии входной строки грамматике
 * 
 * Этот парсер является ключевым компонентом компилятора, который
 * выполняет синтаксический анализ и проверяет, соответствует ли
 * входная строка заданной грамматике.
 */
export class LLParser {
  private lexer: Lexer;
  private table: Table;
  private lastToken?: Token;
  private error: ErrorReason = { expected: new Set(), received: {} as Token };
  private symbol: string = '';
  private row: TableRow;
  private index: number = 0;
  private stack: number[] = [];

  /**
   * Создает новый LL-парсер
   * @param table Таблица для парсинга
   */
  constructor(table: Table) {
    this.table = table;
    this.lexer = new Lexer('');
    this.row = this.table[0];
  }

  /**
   * Выполняет синтаксический анализ входной строки с использованием таблицы
   * @param input Входная строка
   * @returns true, если строка соответствует грамматике, иначе false
   */
  public parse(input: string): boolean {
    this.lexer = new Lexer(input);
    this.index = 0;
    this.row = this.table[0];
    this.error = { expected: new Set(), received: {} as Token };
    this.stack = [];
    this.shift();

    // Debug
    console.log(`Start symbol: ${this.symbol}`);
    console.log(`Current row: ${JSON.stringify({
      symbol: this.row.symbol,
      guides: Array.from(this.row.guides),
      ptr: this.row.ptr,
      stack: this.row.stack,
      end: this.row.end
    })}`);

    while (true) {
      const { symbol, guides, shift, error, ptr, stack, end } = this.row;

      // Debug
      console.log(`Checking if ${this.symbol} is in guides: ${Array.from(guides)}`);
      
      if (!guides.has(this.symbol)) {
        console.log(`Symbol ${this.symbol} not in guides ${Array.from(guides)}`);
        if (error) {
          this.recordError();
          return false;
        }
        ++this.index;
        this.row = this.table[this.index];
        continue;
      }

      if (end) {
        return true;
      }

      if (shift) {
        this.shift();
      }

      if (stack) {
        this.stack.push(this.index + 1);
      }

      if (ptr !== undefined) {
        this.index = ptr;
      } else {
        this.index = this.stack.pop() ?? 0;
      }
      
      this.row = this.table[this.index];
    }
  }

  /**
   * Возвращает информацию об ошибке
   */
  public getError(): ErrorReason {
    return this.error;
  }

  /**
   * Получает следующий токен и обновляет текущий символ
   * @private
   */
  private shift(): void {
    const token = this.lexer.get();
    this.recordToken(token);
    
    if (token.error === Error.EMPTY_INPUT) {
      this.symbol = END_SYMBOL;
    } else {
      // For now, just use the token value for simplicity
      // This is a workaround for the complex token mapping issue
      if (token.type === TokenType.ID || 
          token.type === TokenType.INTEGER || 
          token.type === TokenType.FLOAT) {
        // For these types, use the type string (id, int, float)
        this.symbol = remapTokenTypeToString(token.type);
      } else {
        // For other tokens, use the actual value
        this.symbol = token.value;
      }
      
      console.log(`Shifted to symbol: ${this.symbol} from token ${token.type} (${token.value})`);
    }
  }

  /**
   * Просматривает следующий токен без его удаления из потока
   * @private
   */
  private peek(): Token {
    const token = this.lexer.peek();
    this.recordToken(token);
    return token;
  }

  /**
   * Проверяет, достигнут ли конец входной строки
   * @private
   */
  private empty(): boolean {
    return this.lexer.empty();
  }

  /**
   * Записывает информацию о токене
   * @param token Токен
   * @private
   */
  private recordToken(token: Token): void {
    this.lastToken = token;
  }

  /**
   * Записывает информацию об ошибке
   * @private
   */
  private recordError(): void {
    if (this.lastToken) {
      this.error = {
        expected: this.row.guides,
        received: this.lastToken
      };
    }
  }
} 