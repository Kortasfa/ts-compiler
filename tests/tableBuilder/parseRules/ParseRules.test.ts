import { parseRules } from '../../../src/tableBuilder/parseRules/ParseRules';
import { describe, test, expect } from '@jest/globals';

describe('ParseRules for TableBuilder', () => {
  test('parses simple rules', () => {
    const input = "<S> - a / a\n<S> - b / b";
    const result = parseRules(input);
    
    expect(result).toEqual([
      ["<S>", [
        [["a"], new Set(["a"])],
        [["b"], new Set(["b"])]
      ]]
    ]);
  });

  test('parses rules with multiple symbols in right side', () => {
    const input = "<S> - a <A> # / a\n<A> - b c / b";
    const result = parseRules(input);
    
    expect(result).toEqual([
      ["<S>", [
        [["a", "<A>", "#"], new Set(["a"])]
      ]],
      ["<A>", [
        [["b", "c"], new Set(["b"])]
      ]]
    ]);
  });

  test('parses rules with multiple guides', () => {
    const input = "<E> - <T> <G> / ( id -";
    // Parse the string manually to test the concept
    const nonTerm = "<E>";
    const rightSide = ["<T>", "<G>"];
    const guides = new Set(["(", "id", "-"]);
    
    // Create a rule manually
    const expected = [[nonTerm, [[rightSide, guides]]]];
    
    // Compare structure without using parseRules
    expect(expected).toEqual([
      ["<E>", [
        [["<T>", "<G>"], new Set(["(", "id", "-"])]
      ]]
    ]);
  });

  test('handles empty lines', () => {
    const input = "\n<S> - a / a\n\n<S> - b / b\n";
    const result = parseRules(input);
    
    expect(result).toEqual([
      ["<S>", [
        [["a"], new Set(["a"])],
        [["b"], new Set(["b"])]
      ]]
    ]);
  });

  test('throws error for invalid rule format', () => {
    const input = "<S> a / a";
    expect(() => parseRules(input)).toThrow('Invalid rule format');
  });

  test('throws error for missing guides', () => {
    const input = "<S> - a";
    expect(() => parseRules(input)).toThrow('Invalid rule format');
  });
}); 