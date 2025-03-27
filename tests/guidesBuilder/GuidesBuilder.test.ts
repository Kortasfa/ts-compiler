import { GuidesBuilder } from '../../src/guidesBuilder/GuidesBuilder';
import { describe, test, expect } from '@jest/globals';

// Custom matcher function to check if strings are equal independent of the order of items in sets
function checkGuidedRules(actual: string | undefined, expected: string): void {
  expect(actual).toBeDefined();
  if (!actual) return;
  
  const actualLines = actual.split('\n');
  const expectedLines = expected.split('\n');
  
  expect(actualLines.length).toEqual(expectedLines.length);
  
  for (let i = 0; i < actualLines.length; i++) {
    const actualLine = actualLines[i];
    
    // Find the matching line in expected
    const expectedLine = expectedLines.find(line => {
      // Extract left part and rule part (before the guides)
      const [actualLeft, actualGuides] = actualLine.split(' / ');
      const [expectedLeft, expectedGuides] = line.split(' / ');
      
      // If left parts match, check guides
      if (actualLeft === expectedLeft) {
        // Convert guides to sets for comparison
        const actualGuidesSet = new Set(actualGuides.split(' '));
        const expectedGuidesSet = new Set(expectedGuides.split(' '));
        
        // Compare sets
        if (actualGuidesSet.size !== expectedGuidesSet.size) return false;
        for (const guide of actualGuidesSet) {
          if (!expectedGuidesSet.has(guide)) return false;
        }
        
        return true;
      }
      
      return false;
    });
    
    expect(expectedLine).toBeDefined();
  }
}

function check(rawRules: string, expected: string) {
  const builder = new GuidesBuilder(rawRules);
  const rules = builder.buildGuidedRules();
  expect(rules).toBeDefined();
  checkGuidedRules(rules, expected);
}

describe('GuidesBuilder', () => {
  test('simple grammar', () => {
    check(
      "<S> -> a <A> #\n" +
      "<S> -> b\n" +
      "<A> -> c <A> <S>\n" +
      "<A> -> e\n",
      "<S> - a <A> # / a\n" +
      "<S> - b / b\n" +
      "<A> - c <A> <S> / c\n" +
      "<A> - e / # b a"
    );
  });

  test('expression grammar', () => {
    check(
      "<Z> -> <E> #\n" +
      "<E> -> <T> <G>\n" +
      "<G> -> + <T> <G>\n" +
      "<G> -> e\n" +
      "<T> -> <F> <U>\n" +
      "<U> -> * <F> <F>\n" +
      "<U> -> e\n" +
      "<F> -> ( <E> )\n" +
      "<F> -> - <F>\n" +
      "<F> -> id\n",
      "<Z> - <E> # / ( - id\n" +
      "<E> - <T> <G> / ( id -\n" +
      "<G> - + <T> <G> / +\n" +
      "<G> - e / # )\n" +
      "<T> - <F> <U> / id - (\n" +
      "<U> - * <F> <F> / *\n" +
      "<U> - e / + # )\n" +
      "<F> - ( <E> ) / (\n" +
      "<F> - - <F> / -\n" +
      "<F> - id / id"
    );
  });

  test('grammar with multi-level empty productions', () => {
    check(
      "<Z> -> <U> #\n" +
      "<U> -> <A> <B> <C>\n" +
      "<A> -> a <A>\n" +
      "<A> -> e\n" +
      "<B> -> b <B>\n" +
      "<B> -> e\n" +
      "<C> -> c <C>\n" +
      "<C> -> e\n",
      "<Z> - <U> # / # a b c\n" +
      "<U> - <A> <B> <C> / # c b a\n" +
      "<A> - a <A> / a\n" +
      "<A> - e / b c #\n" +
      "<B> - b <B> / b\n" +
      "<B> - e / c #\n" +
      "<C> - c <C> / c\n" +
      "<C> - e / #"
    );
  });
}); 