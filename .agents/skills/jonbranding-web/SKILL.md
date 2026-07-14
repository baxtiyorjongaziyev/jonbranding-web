```markdown
# jonbranding-web Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `jonbranding-web` repository, a TypeScript project built with Next.js. You'll learn how to structure files, write imports and exports, follow commit message conventions, and organize tests. These guidelines ensure consistency and maintainability across the codebase.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file and directory names.
  - **Example:**  
    `user-profile.tsx`  
    `api-utils.ts`

### Import Style
- Use **relative imports** for referencing other files within the project.
  - **Example:**  
    ```typescript
    import { fetchData } from '../utils/api-utils';
    ```

### Export Style
- Use **named exports** for functions, components, and constants.
  - **Example:**  
    ```typescript
    // In user-profile.tsx
    export function UserProfile() { ... }
    ```

### Commit Messages
- Follow the **Conventional Commits** standard.
- Use the `chore` prefix for routine tasks.
- Keep commit messages concise (average: 62 characters).
  - **Example:**  
    ```
    chore: update dependencies to latest versions
    ```

## Workflows

### Creating a New Component
**Trigger:** When adding a new UI component  
**Command:** `/create-component`

1. Create a new file in the appropriate directory using kebab-case (e.g., `my-component.tsx`).
2. Use named exports for your component.
   ```typescript
   export function MyComponent() { ... }
   ```
3. Import the component using a relative path where needed.
   ```typescript
   import { MyComponent } from '../components/my-component';
   ```

### Writing a Commit
**Trigger:** When committing changes  
**Command:** `/commit`

1. Write a commit message following the Conventional Commits format.
2. Use the `chore` prefix for maintenance or routine changes.
   - Example:  
     ```
     chore: refactor header component for clarity
     ```

### Adding a Test File
**Trigger:** When adding or updating tests  
**Command:** `/add-test`

1. Create a test file with the `.test.` pattern (e.g., `user-profile.test.ts`).
2. Place the test file alongside the code it tests or in a dedicated `__tests__` directory.
3. Use named exports and relative imports in your test files.

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `api-utils.test.ts`).
- The specific testing framework is not detected; follow project standards or consult the team.
- Example test file structure:
  ```typescript
  import { fetchData } from './api-utils';

  test('fetchData returns expected result', () => {
    // test implementation
  });
  ```

## Commands
| Command             | Purpose                                         |
|---------------------|-------------------------------------------------|
| /create-component   | Scaffold a new component with proper conventions|
| /commit             | Format a commit message according to standards  |
| /add-test           | Add a new test file with correct naming         |
```
