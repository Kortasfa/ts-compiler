import * as fs from 'fs';
import * as readline from 'readline';
import { Error as CompilerError } from './errors/Error';
import { Lexer } from './lexer/Lexer';
import { GuidesBuilder } from './guidesBuilder/GuidesBuilder';
import { TableBuilder } from './tableBuilder/TableBuilder';
import { LLParser } from './LLParser/LLParser';
import { stringifyError } from './LLParser/error/StringifyError';

/**
 * TS-Compiler - Компилятор на TypeScript
 * 
 * Данный проект представляет собой реализацию компилятора,
 * использующего технику LL-парсинга для синтаксического анализа.
 * Компилятор включает в себя следующие компоненты:
 * 
 * 1. Лексический анализатор (Lexer) - преобразует поток символов в токены
 * 2. GuidesBuilder - строит направляющие множества для правил грамматики
 * 3. TableBuilder - создает таблицу LL-парсера на основе правил
 * 4. LLParser - выполняет синтаксический анализ входной строки
 * 
 * Компилятор принимает файл с грамматикой и анализирует
 * введенные пользователем выражения на соответствие этой грамматике.
 */

/**
 * Структура аргументов командной строки
 */
interface Args {
  inputFileName: string;
}

/**
 * Разбор аргументов командной строки
 * 
 * Проверяет корректность переданных аргументов
 * и извлекает имя файла с грамматикой.
 * Ожидает ровно один аргумент - путь к файлу грамматики.
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
 * 
 * Каждому коду ошибки компилятора соответствует подробное
 * текстовое описание, которое помогает пользователю понять
 * суть проблемы при анализе выражения.
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
 * 
 * Выполняет инициализацию компилятора и запускает интерактивный режим
 * для анализа выражений, введенных пользователем.
 * 
 * Порядок работы:
 * 1. Чтение файла с грамматикой
 * 2. Построение направляющих множеств
 * 3. Создание таблицы LL-парсера
 * 4. Запуск интерактивного режима для анализа выражений
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

/**
 * Экспорт интерфейса для использования модуля
 * 
 * Экспортирует основные компоненты компилятора для их
 * использования в других проектах. Позволяет использовать
 * как весь компилятор целиком, так и отдельные его части.
 */
export { Lexer } from './lexer/Lexer';
export { Token, TokenType } from './lexer/token/Token';
export { Error } from './errors/Error';
export { GuidesBuilder } from './guidesBuilder/GuidesBuilder';
export { TableBuilder } from './tableBuilder/TableBuilder';
export { LLParser } from './LLParser/LLParser';
export { stringifyError } from './LLParser/error/StringifyError'; 