import { GuidesBuilder } from './src/guidesBuilder/GuidesBuilder';
import { TableBuilder } from './src/tableBuilder/TableBuilder';
import { LLParser } from './src/LLParser/LLParser';
import { stringifyError } from './src/LLParser/error/StringifyError';
import * as fs from 'fs';

// Определяем очень простую грамматику для тестирования парсера
const rawRules = `
<S> -> <A> #
<A> -> id <B>
<B> -> id <A> | e
`;

console.log('Построение направляющих множеств...');
const guidesBuilder = new GuidesBuilder(rawRules);
const guidedRules = guidesBuilder.buildGuidedRules();

if (!guidedRules) {
  console.error('Не удалось построить направляющие множества');
  process.exit(1);
}

console.log('\nНаправляющие множества:');
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
testParse('a');          // a - идентификатор
testParse('a b');        // a и b - идентификаторы (a id b)
testParse('a b c');      // a, b и c - идентификаторы (a id b id c)
testParse('a b c d');    // a, b, c и d - идентификаторы (a id b id c id d)
testParse('');           // Неверно, пустой ввод
testParse('a a');        // Неверно, ожидается идентификатор после идентификатора
testParse('a b c d e');  // Неверно, слишком много идентификаторов

console.log('\nВсе тесты завершены!'); 