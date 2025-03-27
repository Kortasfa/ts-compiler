import { Lexer } from '../../src/lexer/Lexer';
import { Token, TokenType } from '../../src/lexer/token/Token';
import { Error } from '../../src/errors/Error';
import { describe, test, expect } from '@jest/globals';

/**
 * Вспомогательная функция для проверки последовательности токенов
 */
function check(lexer: Lexer, ...expectedTokens: Token[]) {
  for (const expected of expectedTokens) {
    const token = lexer.get();
    expect(token.type).toBe(expected.type);
    expect(token.value).toBe(expected.value);
    expect(token.pos).toBe(expected.pos);
    expect(token.error).toBe(expected.error);
  }
}

describe('Lexer', () => {
  test('peek token', () => {
    const lexer = new Lexer('first second');
    
    expect(lexer.peek()).toEqual({ type: TokenType.ID, value: 'first', pos: 0, error: Error.NONE });
    expect(lexer.peek()).toEqual({ type: TokenType.ID, value: 'first', pos: 0, error: Error.NONE });
    expect(lexer.get()).toEqual({ type: TokenType.ID, value: 'first', pos: 0, error: Error.NONE });
    expect(lexer.peek()).toEqual({ type: TokenType.ID, value: 'second', pos: 6, error: Error.NONE });
    expect(lexer.get()).toEqual({ type: TokenType.ID, value: 'second', pos: 6, error: Error.NONE });
  });

  test('empty lexer', () => {
    check(
      new Lexer(''),
      { type: TokenType.ERROR, value: '', pos: 0, error: Error.EMPTY_INPUT }
    );

    check(
      new Lexer('    '),
      { type: TokenType.ERROR, value: '', pos: 4, error: Error.EMPTY_INPUT }
    );
  });

  test('valid id tests', () => {
    check(
      new Lexer('id secondId    m_id a _$s123 plus+'),
      { type: TokenType.ID, value: 'id', pos: 0, error: Error.NONE },
      { type: TokenType.ID, value: 'secondId', pos: 3, error: Error.NONE },
      { type: TokenType.ID, value: 'm_id', pos: 15, error: Error.NONE },
      { type: TokenType.ID, value: 'a', pos: 20, error: Error.NONE },
      { type: TokenType.ID, value: '_$s123', pos: 22, error: Error.NONE },
      { type: TokenType.ID, value: 'plus', pos: 29, error: Error.NONE }
    );
  });

  test('invalid id tests', () => {
    check(
      new Lexer('obj.id.field error.'),
      { type: TokenType.ID, value: 'obj.id.field', pos: 0, error: Error.NONE },
      { type: TokenType.ERROR, value: '', pos: 13, error: Error.INVALID_ID }
    );
  });

  test('valid numbers tests', () => {
    check(
      new Lexer('5 0 123 12.52 0.25 0.0013 1e+10 100.53E-15'),
      { type: TokenType.INTEGER, value: '5', pos: 0, error: Error.NONE },
      { type: TokenType.INTEGER, value: '0', pos: 2, error: Error.NONE },
      { type: TokenType.INTEGER, value: '123', pos: 4, error: Error.NONE },
      { type: TokenType.FLOAT, value: '12.52', pos: 8, error: Error.NONE },
      { type: TokenType.FLOAT, value: '0.25', pos: 14, error: Error.NONE },
      { type: TokenType.FLOAT, value: '0.0013', pos: 19, error: Error.NONE },
      { type: TokenType.FLOAT, value: '1e+10', pos: 26, error: Error.NONE },
      { type: TokenType.FLOAT, value: '100.53E-15', pos: 32, error: Error.NONE }
    );
  });

  test('invalid numbers tests', () => {
    check(new Lexer('05'), { type: TokenType.ERROR, value: '', pos: 0, error: Error.INVALID_NUMBER });
    check(new Lexer('00.5'), { type: TokenType.ERROR, value: '', pos: 0, error: Error.INVALID_NUMBER });
    check(new Lexer('12e+'), { type: TokenType.ERROR, value: '', pos: 0, error: Error.INVALID_NUMBER });
    check(new Lexer('12.e+10'), { type: TokenType.ERROR, value: '', pos: 0, error: Error.INVALID_NUMBER });
    check(new Lexer('42.53e'), { type: TokenType.ERROR, value: '', pos: 0, error: Error.INVALID_NUMBER });
    check(new Lexer(' 42.53e10'), { type: TokenType.ERROR, value: '', pos: 1, error: Error.INVALID_NUMBER });
    check(new Lexer('  42.53e+0'), { type: TokenType.ERROR, value: '', pos: 2, error: Error.INVALID_NUMBER });
  });

  test('valid string tests', () => {
    check(
      new Lexer("'' 'Hello, World!'"),
      { type: TokenType.STRING_LITERAL, value: "''", pos: 0, error: Error.NONE },
      { type: TokenType.STRING_LITERAL, value: "'Hello, World!'", pos: 3, error: Error.NONE }
    );
  });

  test('invalid string tests', () => {
    check(new Lexer("'"), { type: TokenType.ERROR, value: '', pos: 0, error: Error.STRING_LITERAL_INCOMPLETE });
    check(new Lexer("   'Hello"), { type: TokenType.ERROR, value: '', pos: 3, error: Error.STRING_LITERAL_INCOMPLETE });
  });

  test('reserved words tests', () => {
    check(
      new Lexer('mod div and or not true false'),
      { type: TokenType.OP_MOD, value: 'mod', pos: 0, error: Error.NONE },
      { type: TokenType.OP_DIV, value: 'div', pos: 4, error: Error.NONE },
      { type: TokenType.OP_AND, value: 'and', pos: 8, error: Error.NONE },
      { type: TokenType.OP_OR, value: 'or', pos: 12, error: Error.NONE },
      { type: TokenType.OP_NOT, value: 'not', pos: 15, error: Error.NONE },
      { type: TokenType.TRUE, value: 'true', pos: 19, error: Error.NONE },
      { type: TokenType.FALSE, value: 'false', pos: 24, error: Error.NONE }
    );

    check(new Lexer('nott'), { type: TokenType.ID, value: 'nott', pos: 0, error: Error.NONE });
  });

  test('valid special chars tests', () => {
    check(
      new Lexer('(){}[],+-*/===<><=>=!=!'),
      { type: TokenType.PARAN_OPEN, value: '(', pos: 0, error: Error.NONE },
      { type: TokenType.PARAN_CLOSE, value: ')', pos: 1, error: Error.NONE },
      { type: TokenType.CURLY_OPEN, value: '{', pos: 2, error: Error.NONE },
      { type: TokenType.CURLY_CLOSE, value: '}', pos: 3, error: Error.NONE },
      { type: TokenType.BRACKET_OPEN, value: '[', pos: 4, error: Error.NONE },
      { type: TokenType.BRACKET_CLOSE, value: ']', pos: 5, error: Error.NONE },
      { type: TokenType.COMMA, value: ',', pos: 6, error: Error.NONE },
      { type: TokenType.OP_PLUS, value: '+', pos: 7, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 8, error: Error.NONE },
      { type: TokenType.OP_MUL, value: '*', pos: 9, error: Error.NONE },
      { type: TokenType.OP_DIVISION, value: '/', pos: 10, error: Error.NONE },
      { type: TokenType.OP_EQUAL, value: '==', pos: 11, error: Error.NONE },
      { type: TokenType.OP_ASSIGNMENT, value: '=', pos: 13, error: Error.NONE },
      { type: TokenType.OP_LESS, value: '<', pos: 14, error: Error.NONE },
      { type: TokenType.OP_GREATER, value: '>', pos: 15, error: Error.NONE },
      { type: TokenType.OP_LESS_OR_EQUAL, value: '<=', pos: 16, error: Error.NONE },
      { type: TokenType.OP_GREATER_OR_EQUAL, value: '>=', pos: 18, error: Error.NONE },
      { type: TokenType.OP_NOT_EQUAL, value: '!=', pos: 20, error: Error.NONE },
      { type: TokenType.OP_NOT_MARK, value: '!', pos: 22, error: Error.NONE }
    );
  });

  test('invalid special chars tests', () => {
    check(new Lexer('#'), { type: TokenType.ERROR, value: '#', pos: 0, error: Error.UNKNOWN_SYMBOL });
    check(new Lexer('@'), { type: TokenType.ERROR, value: '@', pos: 0, error: Error.UNKNOWN_SYMBOL });
  });

  test('complex expressions', () => {
    check(
      new Lexer('-a + 5.3E-15 * (-a + -b * (a * -b) -c) != abc'),
      { type: TokenType.OP_MINUS, value: '-', pos: 0, error: Error.NONE },
      { type: TokenType.ID, value: 'a', pos: 1, error: Error.NONE },
      { type: TokenType.OP_PLUS, value: '+', pos: 3, error: Error.NONE },
      { type: TokenType.FLOAT, value: '5.3E-15', pos: 5, error: Error.NONE },
      { type: TokenType.OP_MUL, value: '*', pos: 13, error: Error.NONE },
      { type: TokenType.PARAN_OPEN, value: '(', pos: 15, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 16, error: Error.NONE },
      { type: TokenType.ID, value: 'a', pos: 17, error: Error.NONE },
      { type: TokenType.OP_PLUS, value: '+', pos: 19, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 21, error: Error.NONE },
      { type: TokenType.ID, value: 'b', pos: 22, error: Error.NONE },
      { type: TokenType.OP_MUL, value: '*', pos: 24, error: Error.NONE },
      { type: TokenType.PARAN_OPEN, value: '(', pos: 26, error: Error.NONE },
      { type: TokenType.ID, value: 'a', pos: 27, error: Error.NONE },
      { type: TokenType.OP_MUL, value: '*', pos: 29, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 31, error: Error.NONE },
      { type: TokenType.ID, value: 'b', pos: 32, error: Error.NONE },
      { type: TokenType.PARAN_CLOSE, value: ')', pos: 33, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 35, error: Error.NONE },
      { type: TokenType.ID, value: 'c', pos: 36, error: Error.NONE },
      { type: TokenType.PARAN_CLOSE, value: ')', pos: 37, error: Error.NONE },
      { type: TokenType.OP_NOT_EQUAL, value: '!=', pos: 39, error: Error.NONE },
      { type: TokenType.ID, value: 'abc', pos: 42, error: Error.NONE }
    );

    check(
      new Lexer("5 + 10 * 3.14 - 'test' / 2.5"),
      { type: TokenType.INTEGER, value: '5', pos: 0, error: Error.NONE },
      { type: TokenType.OP_PLUS, value: '+', pos: 2, error: Error.NONE },
      { type: TokenType.INTEGER, value: '10', pos: 4, error: Error.NONE },
      { type: TokenType.OP_MUL, value: '*', pos: 7, error: Error.NONE },
      { type: TokenType.FLOAT, value: '3.14', pos: 9, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 14, error: Error.NONE },
      { type: TokenType.STRING_LITERAL, value: "'test'", pos: 16, error: Error.NONE },
      { type: TokenType.OP_DIVISION, value: '/', pos: 23, error: Error.NONE },
      { type: TokenType.FLOAT, value: '2.5', pos: 25, error: Error.NONE }
    );

    check(
      new Lexer('true and false or x > 10'),
      { type: TokenType.TRUE, value: 'true', pos: 0, error: Error.NONE },
      { type: TokenType.OP_AND, value: 'and', pos: 5, error: Error.NONE },
      { type: TokenType.FALSE, value: 'false', pos: 9, error: Error.NONE },
      { type: TokenType.OP_OR, value: 'or', pos: 15, error: Error.NONE },
      { type: TokenType.ID, value: 'x', pos: 18, error: Error.NONE },
      { type: TokenType.OP_GREATER, value: '>', pos: 20, error: Error.NONE },
      { type: TokenType.INTEGER, value: '10', pos: 22, error: Error.NONE }
    );

    check(
      new Lexer('((5 + 2) * (3 - 1)) / 4'),
      { type: TokenType.PARAN_OPEN, value: '(', pos: 0, error: Error.NONE },
      { type: TokenType.PARAN_OPEN, value: '(', pos: 1, error: Error.NONE },
      { type: TokenType.INTEGER, value: '5', pos: 2, error: Error.NONE },
      { type: TokenType.OP_PLUS, value: '+', pos: 4, error: Error.NONE },
      { type: TokenType.INTEGER, value: '2', pos: 6, error: Error.NONE },
      { type: TokenType.PARAN_CLOSE, value: ')', pos: 7, error: Error.NONE },
      { type: TokenType.OP_MUL, value: '*', pos: 9, error: Error.NONE },
      { type: TokenType.PARAN_OPEN, value: '(', pos: 11, error: Error.NONE },
      { type: TokenType.INTEGER, value: '3', pos: 12, error: Error.NONE },
      { type: TokenType.OP_MINUS, value: '-', pos: 14, error: Error.NONE },
      { type: TokenType.INTEGER, value: '1', pos: 16, error: Error.NONE },
      { type: TokenType.PARAN_CLOSE, value: ')', pos: 17, error: Error.NONE },
      { type: TokenType.PARAN_CLOSE, value: ')', pos: 18, error: Error.NONE },
      { type: TokenType.OP_DIVISION, value: '/', pos: 20, error: Error.NONE },
      { type: TokenType.INTEGER, value: '4', pos: 22, error: Error.NONE }
    );
  });
}); 