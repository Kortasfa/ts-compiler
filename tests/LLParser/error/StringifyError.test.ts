import { stringifyError } from '../../../src/LLParser/error/StringifyError';
import { ErrorReason } from '../../../src/LLParser/LLParser';
import { TokenType } from '../../../src/lexer/token/Token';
import { Error } from '../../../src/errors/Error';
import { describe, test, expect } from '@jest/globals';

describe('StringifyError', () => {
  test('formats error with explicit token value', () => {
    const error: ErrorReason = {
      expected: new Set(['id', '+', '-']),
      received: {
        type: TokenType.OP_MUL,
        value: '*',
        pos: 5,
        error: Error.NONE
      }
    };
    
    const result = stringifyError(error);
    expect(result).toContain('Expected one of [');
    expect(result).toContain('id');
    expect(result).toContain('+');
    expect(result).toContain('-');
    expect(result).toContain('], but received *');
  });
  
  test('formats error with token type when value is empty', () => {
    const error: ErrorReason = {
      expected: new Set(['<EOF>']),
      received: {
        type: TokenType.ERROR,
        value: '',
        pos: 10,
        error: Error.INVALID_NUMBER
      }
    };
    
    const result = stringifyError(error);
    expect(result).toContain('Expected one of [<EOF>], but received <');
  });
  
  test('handles single expected item', () => {
    const error: ErrorReason = {
      expected: new Set([')']),
      received: {
        type: TokenType.OP_PLUS,
        value: '+',
        pos: 7,
        error: Error.NONE
      }
    };
    
    const result = stringifyError(error);
    expect(result).toBe('Expected one of [)], but received +');
  });
  
  test('handles multiple expected items', () => {
    const error: ErrorReason = {
      expected: new Set(['id', 'int', 'float', '(', '-']),
      received: {
        type: TokenType.OP_PLUS,
        value: '+',
        pos: 3,
        error: Error.NONE
      }
    };
    
    const result = stringifyError(error);
    expect(result).toContain('Expected one of [');
    expect(result).toContain('id');
    expect(result).toContain('int');
    expect(result).toContain('float');
    expect(result).toContain('(');
    expect(result).toContain('-');
    expect(result).toContain('], but received +');
  });
}); 