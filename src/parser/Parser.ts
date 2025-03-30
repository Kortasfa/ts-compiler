import { Error } from '../errors/Error';
import { Lexer } from '../lexer/Lexer';
import { Token, TokenType } from '../lexer/token/Token';
import { expression, expressionRem } from './rules/Expression';
import { expressionList, expressionListRem } from './rules/ExpressionList';
import { id, ident, idRem } from './rules/Ident';
import { simExp, simExpRem } from './rules/SimExp';
import { simTerm, simTermRem } from './rules/SimTerm';
import { term } from './rules/Term';

/**
 * Класс для синтаксического анализа входной строки
 */
export class Parser {
  private lexer: Lexer;
  private error: Error = Error.NONE;
  private token?: Token;

  /**
   * Создает новый синтаксический анализатор
   * @param input Входная строка
   */
  constructor(input: string) {
    this.lexer = new Lexer(input);
  }

  /**
   * Выполняет синтаксический анализ входной строки
   * @returns true, если строка соответствует грамматике, иначе false
   */
  public parse(): boolean {
    return this.expression() && this.empty();
  }

  /**
   * Возвращает код ошибки, возникшей при анализе
   */
  public getError(): Error {
    return this.error;
  }

  /**
   * Возвращает последний обработанный токен
   */
  public getLastToken(): Token | undefined {
    return this.token;
  }

  /**
   * Получает следующий токен из лексера
   */
  public get(): Token {
    const token = this.lexer.get();
    this.recordToken(token);
    return token;
  }

  /**
   * Просматривает следующий токен без его удаления из потока
   */
  public peek(): Token {
    const token = this.lexer.peek();
    this.recordToken(token);
    return token;
  }

  /**
   * Записывает информацию о токене
   * @param token Токен
   */
  private recordToken(token: Token): void {
    if (token.type === TokenType.ERROR) {
      this.error = token.error;
    }
    this.token = token;
  }

  /**
   * Отмечает ошибку и возвращает false
   * @param error Код ошибки
   */
  public panic(error: Error): boolean {
    this.error = error;
    return false;
  }

  /**
   * Проверяет, достигнут ли конец входной строки
   */
  public empty(): boolean {
    return this.lexer.empty();
  }

  // Методы реализации правил грамматики
  public expression = expression;
  public expressionRem = expressionRem;
  public expressionList = expressionList;
  public expressionListRem = expressionListRem;
  public ident = ident;
  public id = id;
  public idRem = idRem;
  public simExp = simExp;
  public simExpRem = simExpRem;
  public simTerm = simTerm;
  public simTermRem = simTermRem;
  public term = term;
} 