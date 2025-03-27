/**
 * Пространство имен для сырых правил грамматики
 */
export namespace raw {
  /**
   * Представляет альтернативу в правиле грамматики
   */
  export type Alternative = string[];

  /**
   * Представляет список альтернатив для нетерминала
   */
  export type Alternatives = Alternative[];

  /**
   * Представляет правила грамматики
   */
  export type Rules = [string, Alternatives][];
}

/**
 * Парсит сырые правила грамматики из строки
 * @param input Строка с правилами
 */
export function parseRawRules(input: string): raw.Rules {
  const rules: raw.Rules = [];
  const lines = input.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    
    const parts = line.trim().split(/\s*->\s*/);
    if (parts.length !== 2) {
      throw new Error(`Invalid rule format: ${line}`);
    }
    
    const nonTerm = parts[0].trim();
    const rawAlternativesStr = parts[1].trim();
    
    // Разбиваем на альтернативы через |
    const rawAlternatives = rawAlternativesStr.split('|').map(alt => {
      return alt.trim().split(/\s+/).filter(Boolean);
    });
    
    const existingRule = rules.find(([nt]) => nt === nonTerm);
    if (existingRule) {
      existingRule[1].push(...rawAlternatives);
    } else {
      rules.push([nonTerm, rawAlternatives]);
    }
  }
  
  return rules;
} 