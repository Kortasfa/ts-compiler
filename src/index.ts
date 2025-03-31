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
    throw new Error('Неверное количество аргументов');
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
      return 'Нет ошибки';
    case CompilerError.UNKNOWN_SYMBOL:
      return 'Неизвестный символ';
    case CompilerError.INVALID_NUMBER:
      return 'Неверный формат числа';
    case CompilerError.STRING_LITERAL_INCOMPLETE:
      return 'Незавершенная строка';
    case CompilerError.EMPTY_INPUT:
      return 'Пустой ввод';
    case CompilerError.INVALID_ID:
      return 'Неверный идентификатор';
    case CompilerError.TERM_EXPECTED:
      return 'Ожидается терм';
    case CompilerError.PARAN_CLOSE_EXPECTED:
      return 'Ожидается закрывающая скобка';
    default:
      return `Неизвестный код ошибки: ${error}`;
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
    console.log(`Чтение правил грамматики из файла ${inputFileName}...`);
    const rawRules = fs.readFileSync(inputFileName, 'utf8');
    
    // Построение направляющих множеств
    console.log('Построение направляющих множеств...');
    const guidesBuilder = new GuidesBuilder(rawRules);
    const guidedRules = guidesBuilder.buildGuidedRules();
    
    if (!guidedRules) {
      throw new Error('Не удалось построить направляющие множества');
    }
    
    // Построение таблицы парсера
    console.log('Построение таблицы парсинга...');
    const tableBuilder = new TableBuilder(guidedRules);
    const table = tableBuilder.buildTable();

    console.log(table);
    
    // Создание LL-парсера
    console.log('Создание LL-парсера...');
    const parser = new LLParser(table);
    
    // Настройка интерфейса для чтения из stdin
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('\nВведите выражения для разбора (нажмите Ctrl+C для выхода):');
    
    // Чтение строк из stdin
    for await (const line of rl) {
      // Разбор введенной строки
      const result = parser.parse(line);
      
      if (result) {
        console.log('OK');
      } else {
        const error = parser.getError();
        console.log(`Ошибка: ${stringifyError(error)}`);
      }
      
      console.log('\nВведите другое выражение (нажмите Ctrl+C для выхода):');
    }
    
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Неизвестная ошибка');
    process.exit(1);
  }
}

// Запуск основной функции
if (require.main === module) {
  main().catch(error => {
    console.error('Необработанная ошибка:', error);
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