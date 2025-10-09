## 🚨 CRITICAL REQUIREMENTS (Zod-First Edition)

### Schema as Source of Truth

- All domain models must start as **Zod schemas**.
- **Never** hand-write TypeScript interfaces/types if they can be derived via `z.infer<typeof Schema>`.
- If the schema encodes a closed set of values (e.g., `z.enum` or `z.union`), **derive enums** and use them across the codebase.

### Type Safety (Non-Negotiable)

- **100% type coverage**. No implicit `any` (`"noImplicitAny": true`).
- **All public APIs** and exports must reference **derived types** from schemas.
- **No** `// @ts-ignore` / `// @ts-expect-error` unless unavoidable **and** justified with a one-line reason.

### Modern TypeScript Style

- Use modern TS syntax: `string[]`, not `Array<string>` (unless generics require).
- Always prefer `readonly` for arrays/objects.
- Prefer `const` variables for immutability.
- Use `unknown` and **narrow** aggressively; `any` is forbidden.
- Schemas, derived types, and enums must be **self-documenting** — add JSDoc to public exports.

### Runtime + Static Guarantees

- **Validation**: All runtime validation must use the Zod schemas.
- **Inference**: All compile-time types must be derived from those schemas.
- **No drift** allowed between runtime contracts and static types.
