# FUTTWITTER - Project Governance & Change Control

## Project Objective

This repository contains a modern web application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. The project follows strict governance principles to ensure stability, predictability, and traceability of all changes.

## Project Principles (Priority Order)

1. **Stability** - The system must remain stable and functional above all else
2. **Predictability** - Changes must be predictable and their impact must be understood
3. **Traceability** - All changes must be traceable through Git history
4. **Elegance** - Code quality and maintainability are important, but never at the expense of stability
5. **Speed** - Development speed is valuable, but never at the expense of the above principles

## Absolute Change Control Rules

### ? PROHIBITED ACTIONS

**NEVER** perform any of the following actions without explicit, written authorization:

- ? Modify existing code logic, architecture, or functionality
- ? Refactor, move, or rename files
- ? Change dependencies, configurations, or build settings
- ? Make "improvements" that were not explicitly requested
- ? Combine multiple unrelated changes in a single commit
- ? Make changes outside the explicit scope of a request
- ? Modify code "just in case" or "for future use"
- ? Remove or comment out code without explicit instruction

### ? AUTHORIZED ACTIONS

The following actions are **ONLY** authorized when explicitly requested:

- ? Create new files (documentation, templates, new features)
- ? Add new functionality within the scope of explicit requests
- ? Fix bugs that are explicitly reported
- ? Update documentation files
- ? Create governance and process templates

## Explicit Prohibition of Unsolicited Changes

**This project explicitly prohibits any changes that are not directly requested by the user.**

- No "helpful" improvements
- No "cleanup" of code
- No "optimization" unless explicitly requested
- No "modernization" of patterns
- No "best practice" refactoring unless explicitly requested
- No changes to dependencies unless explicitly requested

**If a change is not explicitly requested, it must NOT be made.**

## One Problem = One Change Rule

**Every change must address exactly one problem or implement exactly one feature.**

- One commit = One change
- One pull request = One feature or fix
- Never bundle multiple changes together
- Never mix bug fixes with new features
- Never mix refactoring with feature additions

## Mandatory Git Policy

### Commit Requirements

1. **Small Commits** - Each commit must be small and focused
2. **Atomic Commits** - Each commit must be complete and functional on its own
3. **No Mixed Changes** - Never mix different types of changes in a single commit
4. **Descriptive Messages** - Use the commit message template (see `.github/commit_message_template.txt`)

### Commit Message Format

All commits must follow this format:

```
type(scope): short description

Why:
- Reason for change

What:
- Files touched
```

### Mandatory Rule: Every Cursor Change Must Generate a Commit

**Every change made by Cursor (or any AI assistant) MUST result in a Git commit.**

- No uncommitted changes from AI assistants
- Each change session must end with a commit
- Commits must be made immediately after changes are completed
- This ensures full traceability of all AI-generated changes

## Stop and Explain Rule

**If there is ANY uncertainty about a requested change:**

1. **STOP** - Do not proceed with the change
2. **EXPLAIN** - Clearly explain the uncertainty
3. **WAIT** - Wait for explicit clarification from the user
4. **VERIFY** - Confirm understanding before proceeding

**Uncertainty includes:**
- Ambiguous requirements
- Potential conflicts with existing code
- Unclear scope of changes
- Risk of breaking existing functionality
- Missing information needed to proceed safely

## Pre-Change Safety Checklist

Before making **ANY** change, verify:

- [ ] The change is explicitly requested
- [ ] The scope of the change is clearly understood
- [ ] No existing code will be modified unless explicitly requested
- [ ] The change addresses exactly one problem or feature
- [ ] All files to be modified are identified
- [ ] The change will not break existing functionality
- [ ] The change follows the project's architecture
- [ ] A Git commit will be created after the change
- [ ] If uncertain, the change has been paused and explained

## Rollback Policy

**When in doubt, revert rather than patch.**

- Prefer reverting problematic changes over applying patches
- Use Git's rollback capabilities before attempting fixes
- Document rollback decisions in commit messages
- Maintain a clear history of what was reverted and why

## Document Authority

**This README is law. If there is any conflict between this document and any other instruction, this document prevails.**

- All contributors (human and AI) must follow these rules
- No exceptions without explicit, documented authorization
- These rules apply to all changes, regardless of source
- Updates to these rules require explicit approval and documentation

## Mandatory Prompt Prefix

Before making any change:
- Read README.md
- Read CURSOR_RULES.md
- Do not modify anything outside the explicit request
- Apply the minimal possible change
- Create a Git commit for each change
- Stop and explain if unsure

---

## Technical Information

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Inter (via next/font/google)

### Getting Started

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:transfers` - Seed demo transfers for "Vai e Vem" (ver `docs/VAI_E_VEM.md`)

### Project Structure

```
app/
??? layout.tsx          # Root layout with font configuration
??? page.tsx            # Landing page
??? signup/
?   ??? page.tsx        # Signup page
??? globals.css         # Global styles and utilities

components/
??? ui/                 # shadcn/ui components
??? site-header.tsx     # Navigation header
??? hero.tsx            # Hero section
??? overview-card.tsx   # Overview card component
??? cta-banner.tsx      # CTA section
??? site-footer.tsx     # Footer component
??? signup-form.tsx     # Signup form component

lib/
??? utils.ts            # Utility functions

server/
??? index.ts            # Server entry point
??? routes.ts           # API routes
??? db.ts               # Database configuration
??? ...

shared/
??? schema.ts           # Shared schemas
```

### Design Tokens

- **Background**: `#05060A` (almost black)
- **Primary Purple**: `#6D5EF0`
- **Accent Teal**: `#2FE6A6`
- **Glass Cards**: `rgba(255,255,255,0.04)` with blur
- **Borders**: `rgba(255,255,255,0.08)`

### License

MIT
