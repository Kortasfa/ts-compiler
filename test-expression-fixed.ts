import { GuidesBuilder } from './src/guidesBuilder/GuidesBuilder';
import { TableBuilder } from './src/tableBuilder/TableBuilder';
import { LLParser } from './src/LLParser/LLParser';
import { stringifyError } from './src/LLParser/error/StringifyError';

// Define an expression grammar using token names instead of symbols
const rawRules = `
<S> -> <E> #
<E> -> <T> <E'>
<E'> -> OP_PLUS <T> <E'> | OP_MINUS <T> <E'> | e
<T> -> <F> <T'>
<T'> -> OP_MUL <F> <T'> | OP_DIV <F> <T'> | e
<F> -> id | int | float | LPAREN <E> RPAREN
`;

console.log('Building guided rules...');
const guidesBuilder = new GuidesBuilder(rawRules);
const guidedRules = guidesBuilder.buildGuidedRules();

if (!guidedRules) {
  console.error('Failed to build guided rules');
  process.exit(1);
}

console.log('Guided rules:');
console.log(guidedRules);

// Now we need to map the token names to actual symbols
// This is the important part to fix the issue
const fixedRules = guidedRules
  .replace(/OP_PLUS/g, '+')
  .replace(/OP_MINUS/g, '-')
  .replace(/OP_MUL/g, '*')
  .replace(/OP_DIV/g, '/')
  .replace(/LPAREN/g, '(')
  .replace(/RPAREN/g, ')');

console.log('\nFixed rules:');
console.log(fixedRules);

console.log('\nBuilding parsing table...');
const tableBuilder = new TableBuilder(fixedRules);
const table = tableBuilder.buildTable();

console.log('\nCreating parser...');
const parser = new LLParser(table);

// Test parsing
const testParse = (input: string) => {
  console.log(`\nParsing: "${input}"`);
  const result = parser.parse(input);
  
  if (result) {
    console.log('ACCEPTED');
  } else {
    const error = parser.getError();
    console.log(`REJECTED: ${stringifyError(error)}`);
  }
};

// Test various expressions
testParse('a');
testParse('123');
testParse('a + b');
testParse('a * b + c');
testParse('(a + b) * c');
testParse('a + b * c');
testParse('a + b + c');
testParse('a * b * c');
testParse('a + b)');      // Invalid, unmatched parenthesis
testParse('a + * b');     // Invalid, consecutive operators
testParse('+ a');         // Invalid, starts with operator

console.log('\nAll tests completed!'); 