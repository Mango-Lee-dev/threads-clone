# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Threads clone app built with React Native and Expo SDK 54. Uses file-based routing with Expo Router.

## Commands

```bash
# Start development server
npm start                 # or: npx expo start

# Run on specific platform
npm run ios              # iOS simulator
npm run android          # Android emulator

# Lint
npm run lint             # or: npx expo lint

# Type check
npx tsc --noEmit
```

## Architecture

### Directory Structure

```
app/                      # Expo Router - file-based routing only
├── _layout.tsx           # Root layout with AuthProvider, SplashScreen, Toast
├── (tabs)/               # Bottom tab navigator
│   ├── (home)/           # Material top tabs (For You / Following)
│   ├── [username]/       # User profile with top tabs
│   ├── (post)/           # Post detail routes
│   └── activity/         # Activity/notifications
├── login.tsx
└── modal.tsx             # Thread creation modal

src/                      # Business logic (non-routing code)
├── features/             # Feature modules
│   └── auth/
│       └── context/AuthContext.tsx
├── services/api/         # API layer with axios
│   ├── client.ts         # Axios instance + interceptors
│   ├── auth.ts           # Auth API endpoints
│   └── posts.ts          # Posts API endpoints
└── types/index.ts        # Shared TypeScript types

mocks/                    # Mirage.js mock server (dev only)
├── server.ts             # Server setup
├── handlers/             # Route handlers
└── data/                 # Dummy data
```

### Key Patterns

**Routing**: Expo Router with route groups `(tabs)`, `(home)`, `(post)`. Dynamic routes use `[param]` syntax.

**State Management**: React Context for auth (`AuthContext`). Local state with `useState` for component data.

**API Layer**: Axios with interceptors for:
- Auto token injection from SecureStore
- 401 handling with token refresh
- Error normalization

**Mock Server**: Mirage.js intercepts requests in `__DEV__`. Setup in `index.ts`, handlers in `mocks/handlers/`.

**Path Alias**: `@/*` maps to project root. Use `@/src/types`, `@/src/services/api`, `@/src/features/auth`.

### Type Definitions

All shared types in `src/types/index.ts`:
- `User`, `Post` - Domain models
- `LoginRequest`, `LoginResponse`, `PostsResponse` - API types
- `ApiError` - Error handling

Import from `@/src/types` (legacy `@/app/types` re-exports for compatibility).

### Authentication Flow

1. `AuthProvider` wraps app in `_layout.tsx`
2. `AuthContext` provides: `user`, `login(username, password)`, `logout()`, `updateUser()`
3. Tokens stored in `expo-secure-store`, user data in `AsyncStorage`

### Animations

Uses both React Native `Animated` and `react-native-reanimated`. Pull-to-refresh implemented with custom `PanResponder` in home screen.
