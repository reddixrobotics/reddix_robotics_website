# Features

This directory contains feature-based modules. Each feature is a self-contained slice of the application.

## Structure

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── products/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
└── contact/
    ├── components/
    ├── hooks/
    └── types/
```

## Conventions

- Each feature folder **mirrors the global `src/` structure** but scoped to that domain.
- Feature-specific services call `apiClient` from `@/services/apiClient`.
- Feature-specific types extend global types from `@/types`.
- Feature components should be re-exported from the feature's `index.ts` only — no deep imports across features.
