# Contributing to NightMind

Thank you for your interest in improving NightMind!  
This project is currently maintained by **Prince Ruhul** ([@princeruhulofficial](https://github.com/princeruhulofficial)).

We welcome contributions of all kinds — bug fixes, new features, documentation improvements, translations, and design polish.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/night-mind.git
   cd night-mind
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials (or use the existing development project if you have access).
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## Development Guidelines

### Code Style
- TypeScript is required for all new code.
- Follow the existing patterns in the codebase (functional components, hooks, TanStack Query).
- Use the existing UI components from `src/components/ui/` (shadcn/ui).
- Prefer Tailwind utility classes over custom CSS.
- Keep components focused and small.

### Branch Naming
- `feat/short-description` — new features
- `fix/issue-description` — bug fixes
- `docs/...` — documentation
- `chore/...` — tooling, dependencies, etc.

### Commit Messages
Use conventional commits when possible:

```
feat: add voice note to weekly debrief
fix: correct life clock calculation for leap years
docs: update setup instructions
chore: upgrade capacitor to 8.3
```

### Testing
- Run existing tests before submitting a PR:
  ```bash
  npm run test
  ```
- Add tests for new logic when it makes sense (especially utility functions and hooks).

---

## Pull Request Process

1. Create a new branch from `main`.
2. Make your changes.
3. Ensure the app builds successfully (`npm run build`).
4. Open a Pull Request against the `main` branch.
5. Fill in the PR template (describe what changed and why).
6. Wait for review. Be open to feedback — we iterate quickly.

---

## Areas We Especially Welcome Help On

- **Internationalization** — improve বাংলা translations or add new languages
- **Accessibility** — keyboard navigation, screen reader support, contrast
- **Mobile polish** — Capacitor-specific improvements, safe areas, notifications
- **AI quality** — better prompts for `generate-plan` and `chat` edge functions
- **Performance** — reduce re-renders, optimize queries
- **Documentation** — tutorials, architecture notes, video walkthroughs

---

## Code of Conduct

Be kind, respectful, and constructive.  
This is a project built with care from Bangladesh with global ambitions. Harassment or toxic behavior will not be tolerated.

---

## Questions?

Open an issue or reach out to the maintainer via GitHub.

Happy building 🌙
