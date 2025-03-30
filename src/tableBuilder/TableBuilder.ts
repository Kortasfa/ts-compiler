import { Guides, Table, TableRow, isTerm, EMPTY } from '../table/Table';
import { Alternative, Alternatives, Rules, parseRules } from './parseRules/ParseRules';

/**
 * Класс для построения таблицы парсинга
 * 
 * TableBuilder преобразует правила грамматики с направляющими множествами
 * в таблицу для LL-парсера. Таблица содержит инструкции для парсера о том,
 * какие действия выполнять при встрече определенных токенов.
 * 
 * Формат входных данных:
 * <S> - <A> / a c   (Нетерминал - Правило / Направляющее множество)
 * <S> - b <B> / b
 * <A> - a / a
 * <A> - c / c
 * <B> - b / b
 * 
 * Алгоритм построения таблицы:
 * 1. Заполнение левой части таблицы нетерминалами и их направляющими множествами
 * 2. Заполнение правой части таблицы терминалами и нетерминалами
 * 3. Установка указателей для переходов между строками таблицы
 * 4. Отметка конечных состояний и обработки ошибок
 */
export class TableBuilder {
  private rules: Rules;

  /**
   * Создает новый построитель таблицы
   * @param input Строка с правилами
   */
  constructor(input: string) {
    this.rules = parseRules(input);
  }

  /**
   * Строит таблицу парсинга на основе правил
   */
  public buildTable(): Table {
    const table: Table = [];
    this.fillLeftNonTerms(table);
    this.fillRightSides(table);

    return table;
  }

  /**
   * Заполняет левую часть таблицы нетерминалами
   * @param table Таблица для заполнения
   * @private
   */
  private fillLeftNonTerms(table: Table): void {
    let ptr = this.getLeftSideNonTermsNumber();
    
    for (const [name, alternatives] of this.rules) {
      for (const [rule, guides] of alternatives) {
        table.push({
          symbol: name,
          guides: guides,
          shift: false,
          error: false,
          ptr: ptr,
          stack: false,
          end: false
        });
        
        ptr += rule.length;
      }
      
      // Последняя строка для нетерминала отмечается как ошибочная
      if (table.length > 0) {
        table[table.length - 1].error = true;
      }
    }
  }

  /**
   * Заполняет правую часть таблицы
   * @param table Таблица для заполнения
   * @private
   */
  private fillRightSides(table: Table): void {
    let isAxiom = true;
    
    for (const [_, alternatives] of this.rules) {
      for (const alternative of alternatives) {
        this.fillAlternative(table, alternative, isAxiom);
        isAxiom = false;
      }
    }
  }

  /**
   * Заполняет таблицу для одной альтернативы
   * @param table Таблица для заполнения
   * @param alternative Альтернатива
   * @param isAxiom Является ли альтернатива аксиомой грамматики
   * @private
   */
  private fillAlternative(table: Table, alternative: Alternative, isAxiom: boolean): void {
    const [rule, guides] = alternative;
    
    for (const symbol of rule) {
      let row: TableRow;
      
      if (isTerm(symbol)) {
        if (symbol === EMPTY) {
          row = {
            symbol: EMPTY,
            guides: guides,
            shift: false,
            error: true,
            ptr: undefined,
            stack: false,
            end: false
          };
        } else {
          row = {
            symbol: symbol,
            guides: new Set([symbol]),
            shift: true,
            error: true,
            ptr: table.length + 1,
            stack: false,
            end: false
          };
        }
      } else {
        row = {
          symbol: symbol,
          guides: this.getNonTermGuides(symbol, table),
          shift: false,
          error: true,
          ptr: this.getNonTermPtr(symbol, table),
          stack: true,
          end: false
        };
      }
      
      table.push(row);
    }
    
    // Обработка последней строки
    if (table.length > 0) {
      const last = table[table.length - 1];
      
      if (isTerm(last.symbol)) {
        last.ptr = undefined;
      } else {
        last.stack = false;
      }
      
      last.end = isAxiom;
    }
  }

  /**
   * Находит указатель на нетерминал в таблице
   * @param symbol Символ нетерминала
   * @param table Таблица
   * @private
   */
  private getNonTermPtr(symbol: string, table: Table): number {
    for (let ptr = 0; ptr < table.length; ptr++) {
      if (table[ptr].symbol === symbol) {
        return ptr;
      }
    }
    
    throw new Error(`Неизвестный нетерминал: ${symbol}`);
  }

  /**
   * Получает направляющие множества для нетерминала
   * @param symbol Символ нетерминала
   * @param table Таблица
   * @private
   */
  private getNonTermGuides(symbol: string, table: Table): Guides {
    const result = new Set<string>();
    const nonTermsCount = this.getLeftSideNonTermsNumber();
    
    for (let i = 0; i < Math.min(nonTermsCount, table.length); i++) {
      const row = table[i];
      
      if (row.symbol === symbol) {
        for (const guide of row.guides) {
          result.add(guide);
        }
      }
    }
    
    return result;
  }

  /**
   * Получает количество нетерминалов в левой части таблицы
   * @private
   */
  private getLeftSideNonTermsNumber(): number {
    let count = 0;
    
    for (const [_, alternatives] of this.rules) {
      count += alternatives.length;
    }
    
    return count;
  }
} 