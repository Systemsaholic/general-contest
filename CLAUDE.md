# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 contest entry form application for Phoenix Voyages, built with TypeScript, React 19, and deployed on Vercel via v0.dev. The application features a multi-step form for a vacation voucher contest where users guess the number of golf tees in a jar.

## Key Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint (currently ignored in builds)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Components**: Custom shadcn/ui components in `components/ui/`
- **Styling**: Tailwind CSS with custom animations
- **Forms**: React Hook Form with Zod validation
- **State**: React useState with controlled components
- **Server Actions**: Next.js server actions for webhook submissions

### Project Structure
- `/app` - Next.js App Router pages (layout.tsx, page.tsx)
- `/components` - React components
  - `/ui` - Reusable shadcn/ui components
  - `multi-step-form.tsx` - Main contest form component
- `/lib` - Utility functions and server actions
  - `actions.ts` - Server-side webhook submissions
  - `utils.ts` - Tailwind utility functions

### Core Flow
1. **Entry Form** (`multi-step-form.tsx`): Collects name, email, phone, and golf tee guess
2. **Preferences Form**: Optional travel preferences collection
3. **Success View**: Confirmation with auto-return timer (10 seconds)
4. **Server Actions** (`lib/actions.ts`): Submits data to Phoenix Voyages webhooks with 8-second timeout

### Key Features
- Mobile-first responsive design
- Form validation with real-time error feedback
- Auto-reset timer after form completion (10 seconds of inactivity)
- Animated transitions between form steps using Framer Motion
- Server-side webhook submissions with error handling

## Important Notes

- ESLint and TypeScript errors are ignored during builds (see `next.config.mjs`)
- The app uses unoptimized images configuration
- Webhook URLs are hardcoded in `lib/actions.ts`
- Background image is located at `/public/images/tropical-beach.png`
- Always use pnpm