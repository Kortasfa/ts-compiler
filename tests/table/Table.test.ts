import { guidesEqual, tableRowEqual, tableEqual, isTerm, Guides, TableRow, Table } from '../../src/table/Table';
import { describe, test, expect } from '@jest/globals';

describe('Table helper functions', () => {
  test('guidesEqual compares two guide sets', () => {
    const a: Guides = new Set(["a", "b", "c"]);
    const b: Guides = new Set(["c", "a", "b"]);
    const c: Guides = new Set(["a", "b"]);
    const d: Guides = new Set(["a", "b", "d"]);
    
    expect(guidesEqual(a, b)).toBe(true);
    expect(guidesEqual(a, c)).toBe(false);
    expect(guidesEqual(a, d)).toBe(false);
    expect(guidesEqual(new Set(), new Set())).toBe(true);
  });
  
  test('tableRowEqual compares two table rows', () => {
    const row1: TableRow = {
      symbol: "<S>",
      guides: new Set(["a", "b"]),
      shift: false,
      error: true,
      ptr: 3,
      stack: false,
      end: false
    };
    
    const row2: TableRow = {
      symbol: "<S>",
      guides: new Set(["b", "a"]),
      shift: false,
      error: true,
      ptr: 3,
      stack: false,
      end: false
    };
    
    const row3: TableRow = {
      symbol: "<S>",
      guides: new Set(["a", "b"]),
      shift: true,
      error: true,
      ptr: 3,
      stack: false,
      end: false
    };
    
    expect(tableRowEqual(row1, row2)).toBe(true);
    expect(tableRowEqual(row1, row3)).toBe(false);
  });
  
  test('tableEqual compares two tables', () => {
    const table1: Table = [
      {
        symbol: "<S>",
        guides: new Set(["a", "b"]),
        shift: false,
        error: true,
        ptr: 1,
        stack: false,
        end: false
      },
      {
        symbol: "a",
        guides: new Set(["a"]),
        shift: true,
        error: true,
        ptr: undefined,
        stack: false,
        end: false
      }
    ];
    
    const table2: Table = [
      {
        symbol: "<S>",
        guides: new Set(["a", "b"]),
        shift: false,
        error: true,
        ptr: 1,
        stack: false,
        end: false
      },
      {
        symbol: "a",
        guides: new Set(["a"]),
        shift: true,
        error: true,
        ptr: undefined,
        stack: false,
        end: false
      }
    ];
    
    const table3: Table = [
      {
        symbol: "<S>",
        guides: new Set(["a", "b"]),
        shift: false,
        error: true,
        ptr: 1,
        stack: false,
        end: false
      }
    ];
    
    expect(tableEqual(table1, table2)).toBe(true);
    expect(tableEqual(table1, table3)).toBe(false);
  });
  
  test('isTerm checks if a symbol is a terminal', () => {
    expect(isTerm("a")).toBe(true);
    expect(isTerm("id")).toBe(true);
    expect(isTerm("e")).toBe(true);
    expect(isTerm("<S>")).toBe(false);
    expect(isTerm("<E>")).toBe(false);
    expect(isTerm("<Term>")).toBe(false);
  });
}); 