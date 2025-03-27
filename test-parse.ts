import { GuidesBuilder } from './src/guidesBuilder/GuidesBuilder';
import { TableBuilder } from './src/tableBuilder/TableBuilder';
import { LLParser } from './src/LLParser/LLParser';
import { stringifyError } from './src/LLParser/error/StringifyError';
import * as fs from 'fs';

// Define a grammar that uses token types, not literals
const rawRules = `
<Z> -> <S> #
<S> -> id
<S> -> int
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

console.log('Table:');
console.log(table);

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

// Test various inputs
testParse('a');       // Should be accepted as ID
testParse('xyz');     // Should be accepted as ID
testParse('123');     // Should be accepted as INTEGER
testParse('a+b');     // Should be rejected (no '+' in grammar)
testParse('');        // Should be rejected (empty input)

console.log('\nAll tests completed!'); 