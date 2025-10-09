# Roo Code Agent Instructions

## Quality Assurance Protocol

**MANDATORY: Before completing ANY task, you MUST run these quality checks:**

### 1. Code Quality Check

```bash
just check
```

This command runs:

- **Biome formatting** (`biome format --write .`)
- **Biome linting** (`biome check --write .`)
- **TypeScript compilation check** (`pnpm run type-check`)

### 2. Test Suite Validation

```bash
just test
```

This command runs:

- **Full test suite** (`npm test`)
- **All unit tests** with coverage validation

## Workflow Requirements

### Pre-Completion Checklist

- [ ] Run `just check` - Ensure no lint errors, proper formatting, and type safety
- [ ] Run `just test` - Verify all tests pass and functionality is intact
- [ ] Confirm no TypeScript compilation errors
- [ ] Verify code formatting meets project standards

### Task Completion Criteria

**A task is only considered complete when:**

1. All code changes are implemented
2. `just check` passes with zero warnings/errors
3. `just test` passes all test cases
4. Documentation is updated if needed
5. No regressions introduced

## Error Handling

- If `just check` fails, fix all linting and type errors before proceeding
- If `just test` fails, debug and resolve test failures
- Never complete a task with failing quality checks

## Project Standards

- **Zero lint warnings** - All biome rules must pass
- **100% test coverage** - All functionality must be tested
- **Type safety** - No TypeScript errors or `any` types
- **Code formatting** - Consistent with biome configuration
