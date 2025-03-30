# TS-Compiler Commands & Guidelines

## Commands
- Build: `npm run build`
- Start: `npm run start`
- Test all: `npm run test`
- Watch tests: `npm run test:watch`
- Run single test: `npx jest tests/path/to/test.test.ts`

## Code Style
- **Imports**: Use named imports only, relative paths
- **Naming**: 
  - PascalCase: Classes, Interfaces, Enums
  - camelCase: Methods, variables, private properties
  - UPPER_SNAKE_CASE: Enum values
- **Types**: Always use explicit return types and parameter types
- **Error Handling**: Use enum-based error codes, not exceptions
- **Formatting**:
  - 2-space indentation
  - Max 80 chars per line
  - JSDoc comments for classes/methods
  - Braces required for all blocks
- **Structure**:
  - Public methods first, then private
  - Constructor at the top
  - Group methods by functionality
  - Single blank line between methods