import * as fs from 'fs';
import * as readline from 'readline';
import { Error as CompilerError } from './errors/Error';
import { Lexer } from './lexer/Lexer';
import { GuidesBuilder } from './guidesBuilder/GuidesBuilder';
import { TableBuilder } from './tableBuilder/TableBuilder';
import { LLParser } from './LLParser/LLParser';
import { stringifyError } from './LLParser/error/StringifyError';

/**
 * Структура аргументов командной строки
 */
interface Args {
  inputFileName: string;
}

/**
 * Разбор аргументов командной строки
 */
function parseArgs(args: string[]): Args {
  if (args.length !== 3) {
    throw new Error('Incorrect number of arguments');
  }

  return {
    inputFileName: args[2]
  };
}

/**
 * Преобразует код ошибки в строку
 */
function stringifyCompilerError(error: CompilerError): string {
  switch (error) {
    case CompilerError.NONE:
      return 'No error';
    case CompilerError.UNKNOWN_SYMBOL:
      return 'Unknown symbol';
    case CompilerError.INVALID_NUMBER:
      return 'Invalid number format';
    case CompilerError.STRING_LITERAL_INCOMPLETE:
      return 'String literal is incomplete';
    case CompilerError.EMPTY_INPUT:
      return 'Empty input';
    case CompilerError.INVALID_ID:
      return 'Invalid identifier';
    case CompilerError.TERM_EXPECTED:
      return 'Term expected';
    case CompilerError.PARAN_CLOSE_EXPECTED:
      return 'Closing parenthesis expected';
    default:
      return `Unknown error code: ${error}`;
  }
}

/**
 * Основная функция программы
 */
async function main() {
  try {
    // Разбор аргументов командной строки
    const { inputFileName } = parseArgs(process.argv);
    
    // Чтение правил из файла
    console.log(`Reading grammar rules from ${inputFileName}...`);
    const rawRules = fs.readFileSync(inputFileName, 'utf8');
    
    // Построение направляющих множеств
    console.log('Building guided rules...');
    const guidesBuilder = new GuidesBuilder(rawRules);
    const guidedRules = guidesBuilder.buildGuidedRules();
    
    if (!guidedRules) {
      throw new Error('Failed to build guided rules');
    }
    
    // Построение таблицы парсера
    console.log('Building parsing table...');
    const tableBuilder = new TableBuilder(guidedRules);
    const table = tableBuilder.buildTable();

    console.log(table);
    
    // Создание LL-парсера
    console.log('Creating LL-parser...');
    const parser = new LLParser(table);
    
    // Настройка интерфейса для чтения из stdin
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('\nEnter expressions to parse (press Ctrl+C to exit):');
    
    // Чтение строк из stdin
    for await (const line of rl) {
      // Разбор введенной строки
      const result = parser.parse(line);
      
      if (result) {
        console.log('OK');
      } else {
        const error = parser.getError();
        console.log(`Error: ${stringifyError(error)}`);
      }
      
      console.log('\nEnter another expression (press Ctrl+C to exit):');
    }
    
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Запуск основной функции
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

// Экспорт интерфейса для использования модуля
export { Lexer } from './lexer/Lexer';
export { Token, TokenType } from './lexer/token/Token';
export { Error } from './errors/Error';
export { GuidesBuilder } from './guidesBuilder/GuidesBuilder';
export { TableBuilder } from './tableBuilder/TableBuilder';
export { LLParser } from './LLParser/LLParser';
export { stringifyError } from './LLParser/error/StringifyError'; 