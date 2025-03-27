import { Guides, EMPTY, isTerm } from '../table/Table';
import { parseRawRules } from './parseRules/ParseRules';
import { raw } from './parseRules/ParseRules';
import { printContainer } from '../print/PrintContainer';

/**
 * Класс для построения направляющих множеств
 */
export class GuidesBuilder {
  private rules: raw.Rules;
  private nonTerms: Set<string>;
  private lexemes: Set<string>;
  private guides: Map<string, Set<string>>;

  /**
   * Создает новый построитель направляющих множеств
   * @param input Строка с правилами
   */
  constructor(input: string) {
    this.rules = parseRawRules(input);
    this.nonTerms = new Set<string>();
    this.lexemes = new Set<string>();
    this.guides = new Map<string, Set<string>>();
    this.init();
  }

  /**
   * Строит правила с направляющими множествами
   */
  public buildGuidedRules(): string | undefined {
    this.buildRelationFirst();
    this.transitiveClosure();

    const lines: string[] = [];
    
    for (const [left, alternatives] of this.rules) {
      const nonTermGuides = this.getGuides(left);
      
      for (const alternative of alternatives) {
        const alternativeGuides = new Set<string>();
        const first = alternative[0];
        
        if (first === EMPTY) {
          continue;
        }
        
        if (!isTerm(first)) {
          const guides = this.getGuides(first);
          
          for (const guide of guides) {
            alternativeGuides.add(guide);
            nonTermGuides.delete(guide);
          }
        } else {
          alternativeGuides.add(first);
          nonTermGuides.delete(first);
        }
        
        lines.push(`${left} - ${alternative.join(' ')} / ${printContainer(alternativeGuides)}`);
      }
      
      // Добавляем правила с EMPTY
      for (const alternative of alternatives.filter(alt => alt[0] === EMPTY)) {
        lines.push(`${left} - ${alternative.join(' ')} / ${printContainer(nonTermGuides)}`);
      }
    }
    
    return lines.length > 0 ? lines.join('\n') : undefined;
  }

  /**
   * Инициализирует структуры данных
   * @private
   */
  private init(): void {
    for (const [left, alternatives] of this.rules) {
      this.nonTerms.add(left);
      this.lexemes.add(left);
      
      for (const alternative of alternatives) {
        for (const lexeme of alternative) {
          this.lexemes.add(lexeme);
        }
      }
    }
  }

  /**
   * Получает направляющие множества для нетерминала
   * @param nonTerm Нетерминал
   * @private
   */
  private getGuides(nonTerm: string): Set<string> {
    const result = new Set<string>();
    const nonTermGuides = this.guides.get(nonTerm);
    
    if (nonTermGuides) {
      for (const guide of nonTermGuides) {
        if (isTerm(guide)) {
          result.add(guide);
        }
      }
    }
    
    return result;
  }

  /**
   * Строит отношение First
   * @private
   */
  private buildRelationFirst(): void {
    for (const [left, alternatives] of this.rules) {
      for (const alternative of alternatives) {
        const guide = alternative[0];
        let guides: Set<string>;
        
        if (guide === EMPTY) {
          guides = this.getFollow(left);
        } else {
          guides = new Set([guide]);
        }
        
        if (!this.guides.has(left)) {
          this.guides.set(left, new Set<string>());
        }
        
        const leftGuides = this.guides.get(left)!;
        for (const g of guides) {
          leftGuides.add(g);
        }
      }
    }
  }

  /**
   * ПолучаетFollow множество для нетерминала
   * @param nonTerm Нетерминал
   * @private
   */
  private getFollow(nonTerm: string): Set<string> {
    const followLexemes = new Set<string>();
    
    for (const [left, alternatives] of this.rules) {
      for (const alternative of alternatives) {
        for (let i = 0; i < alternative.length; i++) {
          if (alternative[i] !== nonTerm) {
            continue;
          }
          
          const isLast = i === alternative.length - 1;
          let follow: Set<string>;
          
          if (isLast) {
            if (left !== nonTerm) {
              follow = this.getFollow(left);
            } else {
              follow = new Set<string>();
            }
          } else {
            follow = new Set<string>([alternative[i + 1]]);
          }
          
          for (const f of follow) {
            followLexemes.add(f);
          }
        }
      }
    }
    
    return followLexemes;
  }

  /**
   * Строит транзитивное замыкание
   * @private
   */
  private transitiveClosure(): void {
    for (const k of this.lexemes) {
      for (const nonTerm of this.nonTerms) {
        for (const lexeme of this.lexemes) {
          const nonTermGuides = this.guides.get(nonTerm);
          const kGuides = this.guides.get(k);
          
          if (nonTermGuides && kGuides && nonTermGuides.has(k) && kGuides.has(lexeme)) {
            nonTermGuides.add(lexeme);
          }
        }
      }
    }
  }
} 