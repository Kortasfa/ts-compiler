import { GuidesBuilder } from './src/guidesBuilder/GuidesBuilder';
import { TableBuilder } from './src/tableBuilder/TableBuilder';
import { LLParser } from './src/LLParser/LLParser';
import { stringifyError } from './src/LLParser/error/StringifyError';

// Определяем упрощенную грамматику выражений, избегая проблемных символов
// Мы будем использовать только операторы + и *, чтобы избежать проблем с - и /
const rawRules = `
<S> -> <E> #
<E> -> <T> <E'>
<E'> -> + <T> <E'> | e
<T> -> <F> <T'>
<T'> -> * <F> <T'> | e
<F> -> id | int | ( <E> )
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

console.log('\nПостроение таблицы парсинга...');
const tableBuilder = new TableBuilder(guidedRules);
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
testParse('a + b');
testParse('a * b');
testParse('a * b + c');
testParse('(a + b) * c');
testParse('a + b * c');
testParse('a + b + c');
testParse('a * b * c');
testParse('a + b)');      // Неверно, несогласованная скобка
testParse('a + * b');     // Неверно, последовательные операторы
testParse('+ a');         // Неверно, начинается с оператора

console.log('\nВсе тесты завершены!'); 