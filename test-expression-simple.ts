import { GuidesBuilder } from './src/guidesBuilder/GuidesBuilder';
import { TableBuilder } from './src/tableBuilder/TableBuilder';
import { LLParser } from './src/LLParser/LLParser';
import { stringifyError } from './src/LLParser/error/StringifyError';

// Define a simpler expression grammar that avoids problematic characters
// We'll only use + and * operators to avoid issues with - and /
const rawRules = `
<S> -> <E> #
<E> -> <T> <E'>
<E'> -> + <T> <E'> | e
<T> -> <F> <T'>
<T'> -> * <F> <T'> | e
<F> -> id | int | ( <E> )
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

console.log('\nBuilding parsing table...');
const tableBuilder = new TableBuilder(guidedRules);
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
testParse('a * b');
testParse('a * b + c');
testParse('(a + b) * c');
testParse('a + b * c');
testParse('a + b + c');
testParse('a * b * c');
testParse('a + b)');      // Invalid, unmatched parenthesis
testParse('a + * b');     // Invalid, consecutive operators
testParse('+ a');         // Invalid, starts with operator

console.log('\nAll tests completed!'); 