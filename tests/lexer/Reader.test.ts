import { Reader } from '../../src/lexer/reader/Reader';
import { describe, test, expect } from '@jest/globals';

describe('Reader', () => {
  test('reading from string', () => {
    const reader = new Reader('abc');
    
    expect(reader.peek()).toBe('a');
    expect(reader.get()).toBe('a');
    expect(reader.get()).toBe('b');
    expect(reader.get()).toBe('c');
    expect(reader.empty()).toBe(true);
  });

  test('peek without advancing', () => {
    const reader = new Reader('abc');
    
    expect(reader.peek()).toBe('a');
    expect(reader.peek()).toBe('a');
    expect(reader.get()).toBe('a');
    expect(reader.peek()).toBe('b');
  });

  test('unget rewinds one character', () => {
    const reader = new Reader('abc');
    
    expect(reader.get()).toBe('a');
    expect(reader.get()).toBe('b');
    reader.unget();
    expect(reader.get()).toBe('b');
    expect(reader.get()).toBe('c');
  });

  test('count returns current position', () => {
    const reader = new Reader('abcdef');
    
    expect(reader.count()).toBe(0);
    reader.get();
    expect(reader.count()).toBe(1);
    reader.get();
    reader.get();
    expect(reader.count()).toBe(3);
    reader.unget();
    expect(reader.count()).toBe(2);
  });

  test('seek sets position', () => {
    const reader = new Reader('abcdef');
    
    reader.get();
    reader.get();
    expect(reader.count()).toBe(2);
    reader.seek(0);
    expect(reader.count()).toBe(0);
    expect(reader.get()).toBe('a');
    reader.seek(5);
    expect(reader.count()).toBe(5);
    expect(reader.get()).toBe('f');
  });

  test('record and stopRecord', () => {
    const reader = new Reader('abcdef');
    
    reader.record();
    reader.get();
    reader.get();
    expect(reader.stopRecord()).toBe('ab');
    
    reader.record();
    reader.get();
    reader.get();
    reader.get();
    expect(reader.stopRecord()).toBe('cde');
  });

  test('empty function', () => {
    const reader = new Reader('a');
    
    expect(reader.empty()).toBe(false);
    reader.get();
    expect(reader.empty()).toBe(true);
  });

  test('error when trying to get from empty reader', () => {
    const reader = new Reader('');
    
    expect(() => reader.get()).toThrow('EOF Error');
  });

  test('complex operations', () => {
    const reader = new Reader('testing');
    
    reader.record();
    expect(reader.get()).toBe('t');
    expect(reader.get()).toBe('e');
    expect(reader.get()).toBe('s');
    reader.unget();
    expect(reader.get()).toBe('s');
    expect(reader.stopRecord()).toBe('tes');
    
    reader.record();
    expect(reader.get()).toBe('t');
    reader.seek(0);
    expect(reader.stopRecord()).toBe('');
    
    reader.record();
    while (!reader.empty()) {
      reader.get();
    }
    expect(reader.stopRecord()).toBe('testing');
  });
}); 