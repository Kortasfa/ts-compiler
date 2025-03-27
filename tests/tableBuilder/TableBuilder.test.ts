import { TableBuilder } from '../../src/tableBuilder/TableBuilder';
import { Table, TableRow } from '../../src/table/Table';
import { describe, test, expect } from '@jest/globals';

function check(str: string, expected: Table) {
  const builder = new TableBuilder(str);
  const table = builder.buildTable();
  expect(table).toEqual(expected);
}

describe('TableBuilder', () => {
  test('simple grammar', () => {
    check(
      "<Z> - <S> # / a b\n" +
      "<S> - a / a\n" +
      "<S> - b / b\n",
      [
        { symbol: "<Z>", guides: new Set(["a", "b"]), shift: false, error: true, ptr: 3, stack: false, end: false },
        { symbol: "<S>", guides: new Set(["a"]), shift: false, error: false, ptr: 5, stack: false, end: false },
        { symbol: "<S>", guides: new Set(["b"]), shift: false, error: true, ptr: 6, stack: false, end: false },
        { symbol: "<S>", guides: new Set(["a", "b"]), shift: false, error: true, ptr: 1, stack: true, end: false },
        { symbol: "#", guides: new Set(["#"]), shift: true, error: true, ptr: undefined, stack: false, end: true },
        { symbol: "a", guides: new Set(["a"]), shift: true, error: true, ptr: undefined, stack: false, end: false },
        { symbol: "b", guides: new Set(["b"]), shift: true, error: true, ptr: undefined, stack: false, end: false },
      ]
    );
  });

  test('list grammar', () => {
    check(
      "<list> - el <listRem> # / el\n" +
      "<listRem> - e / #\n" +
      "<listRem> - , el <listRem> / ,\n",
      [
        { symbol: "<list>", guides: new Set(["el"]), shift: false, error: true, ptr: 3, stack: false, end: false },
        { symbol: "<listRem>", guides: new Set(["#"]), shift: false, error: false, ptr: 6, stack: false, end: false },
        { symbol: "<listRem>", guides: new Set([","]), shift: false, error: true, ptr: 7, stack: false, end: false },
        { symbol: "el", guides: new Set(["el"]), shift: true, error: true, ptr: 4, stack: false, end: false },
        { symbol: "<listRem>", guides: new Set(["#", ","]), shift: false, error: true, ptr: 1, stack: true, end: false },
        { symbol: "#", guides: new Set(["#"]), shift: true, error: true, ptr: undefined, stack: false, end: true },
        { symbol: "e", guides: new Set(["#"]), shift: false, error: true, ptr: undefined, stack: false, end: false },
        { symbol: ",", guides: new Set([","]), shift: true, error: true, ptr: 8, stack: false, end: false },
        { symbol: "el", guides: new Set(["el"]), shift: true, error: true, ptr: 9, stack: false, end: false },
        { symbol: "<listRem>", guides: new Set(["#", ","]), shift: false, error: true, ptr: 1, stack: false, end: false },
      ]
    );
  });
}); 