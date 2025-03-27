import { Guides } from '../../table/Table';

/**
 * Представляет альтернативу в правиле грамматики
 */
export type Alternative = [string[], Guides];

/**
 * Представляет список альтернатив для нетерминала
 */
export type Alternatives = Alternative[];

/**
 * Представляет правила грамматики
 */
export type Rules = [string, Alternatives][];

/**
 * Извлекает направляющие множества из строки
 * @param str Строка с направляющими множествами
 */
function getGuides(str: string): Guides {
  const result = new Set<string>();
  const tokens = str.trim().split(/\s+/);
  
  for (const token of tokens) {
    if (token) {
      result.add(token);
    }
  }
  
  return result;
}

/**
 * Извлекает правую часть правила из строки
 * @param str Строка с правой частью правила
 */
function getRuleRightSide(str: string): [string[], string] {
  // Special case: if the string starts with "-" character, we need to handle it specially
  // to avoid confusing it with the rule separator
  let rightSideStr: string;
  let guidesStr: string;
  
  if (str.trim().startsWith('- ') || str.trim() === '-') {
    // This is a rule that starts with a minus sign
    const slashIndex = str.indexOf('/');
    if (slashIndex === -1) {
      throw new Error(`Invalid rule format (missing guide separator): ${str}`);
    }
    
    rightSideStr = str.substring(0, slashIndex).trim();
    guidesStr = str.substring(slashIndex + 1).trim();
  } else {
    const parts = str.trim().split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid rule format: ${str}`);
    }
    
    rightSideStr = parts[0].trim();
    guidesStr = parts[1].trim();
  }
  
  const rightSide = rightSideStr.split(/\s+/).filter(Boolean);
  return [rightSide, guidesStr];
}

/**
 * Извлекает альтернативу из строки
 * @param str Строка с альтернативой
 */
function getAlternative(str: string): Alternative {
  const [rightSide, guidesStr] = getRuleRightSide(str);
  const guides = getGuides(guidesStr);
  
  return [rightSide, guides];
}

/**
 * Парсит правила грамматики из строки
 * @param input Строка с правилами
 */
export function parseRules(input: string): Rules {
  const rules: Rules = [];
  const lines = input.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    
    // Handle the line differently if it contains a rule with a minus sign
    let nonTerm: string;
    let altStr: string;
    
    // Find the first occurrence of " - " (space-dash-space)
    const ruleIndex = line.indexOf(' - ');
    if (ruleIndex !== -1) {
      nonTerm = line.substring(0, ruleIndex).trim();
      altStr = line.substring(ruleIndex + 3).trim();
    } else {
      const parts = line.split('-');
      if (parts.length !== 2) {
        throw new Error(`Invalid rule format: ${line}`);
      }
      nonTerm = parts[0].trim();
      altStr = parts[1].trim();
    }
    
    try {
      const alternative = getAlternative(altStr);
      
      const existingRule = rules.find(([nt]) => nt === nonTerm);
      if (existingRule) {
        existingRule[1].push(alternative);
      } else {
        rules.push([nonTerm, [alternative]]);
      }
    } catch (error: any) {
      throw new Error(`Error parsing rule: ${line}. ${error.message || 'Unknown error'}`);
    }
  }
  
  return rules;
} 