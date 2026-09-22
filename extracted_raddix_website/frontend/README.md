# Reddix Robotics — Frontend

Production-quality React + TypeScript + Vite frontend for **Reddix Robotics**.  
Designed to integrate seamlessly with a NestJS REST API backend without architectural changes.

---

## Tech Stack

| Layer        | Technology                                         |
|--------------|----------------------------------------------------|
| Framework    | [React 18](https://react.dev) + [TypeScript 5](https://typescriptlang.org) (strict) |
| Build        | [Vite 5](https://vitejs.dev)                       |
| Styling      | [Tailwind CSS 3](https://tailwindcss.com)          |
| Routing      | [React Router v6](https://reactrouter.com) (data API) |
| Animation    | [Framer Motion](https://www.framer.com/motion/)    |
| Icons        | [Lucide React](https://lucide.dev)                 |
| 3D           | [Three.js](https://threejs.org) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| HTTP Client  | [Axios](https://axios-http.com) (centralised API client) |
| Linting      | [ESLint](https://eslint.org) (flat config, TypeScript strict) |
| Formatting   | [Prettier](https://prettier.io) + `prettier-plugin-tailwindcss` |

---

## Prerequisites

- **Node.js** ≥ 18.x (LTS recommended)
- **npm** ≥ 9.x (or pnpm / yarn — adapt commands accordingly)

---

## Getting Started

### 1. Clone & navigate

```bash
git clone <repo-url>
cd reddix_robotics_website/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and set at minimum:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

> `.env.local` is git-ignored. **Never commit secrets.**

### 4. Start the development server

```bash
npm run dev
```

Opens at **http://localhost:5173**

---

## Available Scripts

| Command                | Description                              |
|------------------------|------------------------------------------|
| `npm run dev`          | Start Vite dev server (HMR)              |
| `npm run build`        | Type-check + build production bundle     |
| `npm run preview`      | Preview production build locally         |
| `npm run lint`         | Run ESLint (exits 1 on any warning)      |
| `npm run lint:fix`     | Auto-fix ESLint issues                   |
| `npm run format`       | Format all source files with Prettier    |
| `npm run format:check` | Check formatting without writing files   |
| `npm run type-check`   | Run TypeScript compiler (no emit)        |

---

## Folder Architecture

```
frontend/
├── public/               # Static assets served as-is
├── src/
│   ├── assets/           # Images, SVG icons, 3D models
│   │
│   ├── components/       # Reusable UI components
│   │   ├── layout/       #   Header, Footer, Sidebar
│   │   └── ui/           #   Button, Card, Badge, Section…
│   │
│   ├── data/             # Static constants (nav links, brand info)
│   │
│   ├── features/         # Domain-scoped feature modules
│   │   └── <feature>/    #   components/, hooks/, services/, types/
│   │
│   ├── hooks/            # Shared custom React hooks
│   │   ├── useAsync.ts
│   │   ├── useMediaQuery.ts
│   │   └── useScrolled.ts
│   │
│   ├── layouts/          # Page shell layouts (RootLayout…)
│   │
│   ├── pages/            # Route-level page components (stubs)
│   │
│   ├── routes/           # Centralised routing config
│   │   ├── index.tsx     #   createBrowserRouter definition
│   │   └── routePaths.ts #   ROUTES constants + buildPath()
│   │
│   ├── services/         # API service layer
│   │   ├── apiClient.ts  #   Axios instance (JWT, error handling)
│   │   └── *.service.ts  #   Per-resource services
│   │
│   ├── styles/
│   │   └── index.css     # Tailwind directives + global styles
│   │
│   ├── types/            # Shared TypeScript types
│   │   ├── api.types.ts  #   API response envelopes
│   │   └── common.types.ts
│   │
│   ├── utils/            # Pure utility functions
│   │   ├── cn.ts         #   clsx + tailwind-merge helper
│   │   ├── helpers.ts    #   Date, string, math utilities
│   │   └── featureFlags.ts
│   │
│   ├── App.tsx           # Root component (RouterProvider)
│   └── main.tsx          # ReactDOM entry point
│
├── .env.example          # Environment variable documentation
├── .eslintrc / eslint.config.js
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Path Aliases

The `@/` alias maps to `src/`. Use absolute imports everywhere:

```ts
import { Button } from '@/components/ui';
import { apiClient } from '@/services';
import type { ApiResponse } from '@/types';
```

---

## Environment Variables

All browser-exposed variables **must** be prefixed with `VITE_`.  
See [`.env.example`](./.env.example) for the full list with descriptions.

| Variable                   | Required | Description                          |
|----------------------------|----------|--------------------------------------|
| `VITE_API_BASE_URL`        | ✅        | NestJS API base URL                  |
| `VITE_API_TIMEOUT`         | ❌        | Axios timeout in ms (default 15000)  |
| `VITE_APP_NAME`            | ❌        | App display name                     |
| `VITE_FEATURE_3D_HERO`     | ❌        | Enable Three.js hero scene           |
| `VITE_FEATURE_CONTACT_FORM`| ❌        | Enable live contact form             |

---

## Integrating the NestJS Backend

1. Set `VITE_API_BASE_URL` to your NestJS server URL.
2. Add a new service file in `src/services/`:

```ts
// src/services/robots.service.ts
import apiClient from './apiClient';
import type { ApiResponse, PaginatedResponse } from '@/types';

export interface Robot {
  id: string;
  name: string;
}

export const robotsService = {
  getAll: () =>
    apiClient.get<PaginatedResponse<Robot>>('/robots').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Robot>>(`/robots/${id}`).then((r) => r.data),
};
```

3. Consume it in a feature hook using `useAsync` from `@/hooks`.

---

## Code Quality

- **TypeScript strict mode** — `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `exactOptionalPropertyTypes`
- **ESLint** enforces `@typescript-eslint/strict`, `react-hooks/rules-of-hooks`, no `any`
- **Prettier** sorts Tailwind classes automatically via `prettier-plugin-tailwindcss`
- **VS Code** integration — format on save, ESLint auto-fix, Tailwind IntelliSense

---

## Recommended VS Code Extensions

Install via the workspace recommendation prompt or:

```
dbaeumer.vscode-eslint
esbenp.prettier-vscode
bradlc.vscode-tailwindcss
ms-vscode.vscode-typescript-next
```

---

## License

Private — © Reddix Robotics. All rights reserved.
