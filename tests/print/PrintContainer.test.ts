import { printContainer } from '../../src/print/PrintContainer';
import { describe, test, expect } from '@jest/globals';

describe('PrintContainer', () => {
  test('formats array as space-separated string', () => {
    expect(printContainer(["a", "b", "c"])).toBe("a b c");
    expect(printContainer([1, 2, 3])).toBe("1 2 3");
  });
  
  test('formats Set as space-separated string', () => {
    expect(printContainer(new Set(["a", "b", "c"]))).toBe("a b c");
    expect(printContainer(new Set([1, 2, 3]))).toBe("1 2 3");
  });
  
  test('handles empty containers', () => {
    expect(printContainer([])).toBe("");
    expect(printContainer(new Set())).toBe("");
  });
  
  test('handles single item containers', () => {
    expect(printContainer(["a"])).toBe("a");
    expect(printContainer(new Set([1]))).toBe("1");
  });
}); 