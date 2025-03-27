# Handling Special Characters in Grammar Rules

## Problem

When working with the `TableBuilder` class and parsing grammar rules, we encountered issues with special characters that serve dual purposes:

1. The `-` (minus) character is used both as an operator in expressions and as a separator in rule definitions.
2. The `/` (slash) character is used both as a division operator and as a separator between right side rules and guides.

This creates conflicts when parsing the grammar rules in the `ParseRules` module.

## Solution Approaches

### 1. Token Names Instead of Symbols

Use token names instead of actual symbols in grammar rules, then replace them with actual symbols after guided rules have been built but before creating the table:

```typescript
// Original grammar with token names
const rawRules = `
<S> -> <E> #
<E> -> <T> <E'>
<E'> -> OP_PLUS <T> <E'> | OP_MINUS <T> <E'> | e
<T> -> <F> <T'>
<T'> -> OP_MUL <F> <T'> | OP_DIV <F> <T'> | e
<F> -> id | int | float | LPAREN <E> RPAREN
`;

// Build guides
const guidesBuilder = new GuidesBuilder(rawRules);
const guidedRules = guidesBuilder.buildGuidedRules();

// Replace token names with actual symbols
const fixedRules = guidedRules
  .replace(/OP_PLUS/g, '+')
  .replace(/OP_MINUS/g, '-')
  .replace(/OP_MUL/g, '*')
  .replace(/OP_DIV/g, '/')
  .replace(/LPAREN/g, '(')
  .replace(/RPAREN/g, ')');
```

### 2. Enhanced Rule Parsing

Modify the `parseRules` function in `TableBuilder/parseRules/ParseRules.ts` to handle special cases for operators:

```typescript
// Handle the line differently if it contains a rule with a minus sign
const ruleIndex = line.indexOf(' - ');
if (ruleIndex !== -1) {
  nonTerm = line.substring(0, ruleIndex).trim();
  altStr = line.substring(ruleIndex + 3).trim();
} else {
  const parts = line.split('-');
  if (parts.length !== 2) {
    throw new Error(`Invalid rule format: ${line}`);
  }
  nonTerm = parts[0].trim();
  altStr = parts[1].trim();
}
```

Similarly, for the slash operator, we can modify `getRuleRightSide`:

```typescript
if (str.trim().startsWith('- ') || str.trim() === '-') {
  // This is a rule that starts with a minus sign
  const slashIndex = str.indexOf('/');
  if (slashIndex === -1) {
    throw new Error(`Invalid rule format (missing guide separator): ${str}`);
  }
  
  rightSideStr = str.substring(0, slashIndex).trim();
  guidesStr = str.substring(slashIndex + 1).trim();
}
```

### 3. Simplify Grammar

For cases where special characters cause issues, you can simplify the grammar to avoid problematic operators:

```typescript
// Simplified grammar without problematic operators
const rawRules = `
<S> -> <E> #
<E> -> <T> <E'>
<E'> -> + <T> <E'> | e
<T> -> <F> <T'>
<T'> -> * <F> <T'> | e
<F> -> id | int | ( <E> )
`;
```

## Recommendations

1. **Use token names**: When defining grammar rules, prefer using token names like `OP_PLUS` instead of `+`.

2. **Replace before building table**: If you use token names, replace them with actual symbols after building guided rules but before constructing the table.

3. **Modify parsers**: Ensure your parsing logic can handle special cases for operators that overlap with syntax.

4. **Escape characters**: Consider introducing escape mechanisms for special characters in your grammar notation.

5. **Better separators**: Instead of overloading `-` and `/`, consider using different characters like `=>` for rules and `||` for guides.

By following these recommendations, you can avoid conflicts between operators and syntax symbols in your grammar definitions. 