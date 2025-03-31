import { GuidesBuilder } from './src/guidesBuilder/GuidesBuilder';
import { TableBuilder } from './src/tableBuilder/TableBuilder';
import { LLParser } from './src/LLParser/LLParser';
import { stringifyError } from './src/LLParser/error/StringifyError';

// Определяем грамматику выражений с использованием имен токенов вместо символов
// для избежания проблем с парсингом правил
const rawRules = `
<S> -> <E> #
<E> -> <T> <E'>
<E'> -> OP_PLUS <T> <E'> | OP_MINUS <T> <E'> | e
<T> -> <F> <T'>
<T'> -> OP_MUL <F> <T'> | OP_DIV <F> <T'> | e
<F> -> id | int | float | LPAREN <E> RPAREN
`;

console.log('Построение направляющих множеств...');
const guidesBuilder = new GuidesBuilder(rawRules);
const guidedRules = guidesBuilder.buildGuidedRules();

if (!guidedRules) {
  console.error('Не удалось построить направляющие множества');
  process.exit(1);
}

console.log('Направляющие множества:');
console.log(guidedRules);

// Заменяем имена токенов на фактические символы перед построением таблицы
console.log('\nЗамена имен токенов на символы...');
const fixedRules = guidedRules
  .replace(/OP_PLUS/g, '+')
  .replace(/OP_MINUS/g, '-')
  .replace(/OP_MUL/g, '*')
  .replace(/OP_DIV/g, '/')
  .replace(/LPAREN/g, '(')
  .replace(/RPAREN/g, ')');

console.log('Исправленные правила:');
console.log(fixedRules);

console.log('\nПостроение таблицы парсинга...');
const tableBuilder = new TableBuilder(fixedRules);
const table = tableBuilder.buildTable();

console.log('\nСоздание парсера...');
const parser = new LLParser(table);

// Тестирование парсинга
const testParse = (input: string) => {
  console.log(`\nАнализ: "${input}"`);
  const result = parser.parse(input);
  
  if (result) {
    console.log('ПРИНЯТО');
  } else {
    const error = parser.getError();
    console.log(`ОТКЛОНЕНО: ${stringifyError(error)}`);
  }
};

// Тестируем различные выражения
testParse('a');
testParse('123');
testParse('3.14');
testParse('a + b');
testParse('a - b');
testParse('a * b');
testParse('a / b');
testParse('a * b + c');
testParse('a - b / c');
testParse('(a + b) * c');
testParse('a + b * c');
testParse('a + b + c');
testParse('a * b * c');
testParse('a / b / c');
testParse('a + b)');      // Неверно, несогласованная скобка
testParse('a + * b');     // Неверно, последовательные операторы
testParse('+ a');         // Неверно, начинается с оператора

console.log('\nВсе тесты завершены!'); 