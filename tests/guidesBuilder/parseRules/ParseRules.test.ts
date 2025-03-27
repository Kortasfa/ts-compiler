import { parseRawRules, raw } from '../../../src/guidesBuilder/parseRules/ParseRules';
import { describe, test, expect } from '@jest/globals';

describe('ParseRawRules for GuidesBuilder', () => {
  test('parses simple rules', () => {
    const input = "<S> -> a\n<S> -> b";
    const result = parseRawRules(input);
    
    expect(result).toEqual([
      ["<S>", [
        ["a"],
        ["b"]
      ]]
    ]);
  });

  test('parses rules with multiple symbols in right side', () => {
    const input = "<S> -> a <A> #\n<A> -> b c";
    const result = parseRawRules(input);
    
    expect(result).toEqual([
      ["<S>", [
        ["a", "<A>", "#"]
      ]],
      ["<A>", [
        ["b", "c"]
      ]]
    ]);
  });

  test('parses rules with alternatives using pipe symbol', () => {
    const input = "<E> -> <T> <G> | id | <F>";
    const result = parseRawRules(input);
    
    expect(result).toEqual([
      ["<E>", [
        ["<T>", "<G>"],
        ["id"],
        ["<F>"]
      ]]
    ]);
  });

  test('handles empty lines', () => {
    const input = "\n<S> -> a\n\n<S> -> b\n";
    const result = parseRawRules(input);
    
    expect(result).toEqual([
      ["<S>", [
        ["a"],
        ["b"]
      ]]
    ]);
  });

  test('handles empty production', () => {
    const input = "<A> -> e";
    const result = parseRawRules(input);
    
    expect(result).toEqual([
      ["<A>", [
        ["e"]
      ]]
    ]);
  });

  test('throws error for invalid rule format', () => {
    const input = "<S> a";
    expect(() => parseRawRules(input)).toThrow('Invalid rule format');
  });
}); 