# Contributing to Astral Power

First off, thank you for considering contributing to Astral Power! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code samples, screenshots, etc.)
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes**: `npm test`
5. **Update documentation** if needed
6. **Write a clear commit message** following conventional commits

#### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(agents): add velocity-based training algorithm

Implements VBT tracking for more precise fatigue management.
Uses bar speed measurements to adjust training loads.

Closes #123
```

```
fix(ui): correct RPE scale display on mobile

The RPE buttons were overflowing on small screens.
Changed grid layout to wrap properly.
```

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/astral-power.git
   cd astral-power
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Document complex types with JSDoc comments

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and prop names
- Extract reusable logic into custom hooks

### File Organization

- Place components in `/components`
- Place API routes in `/app/api`
- Place agents in `/lib/agents`
- Place tests alongside the code they test

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Testing

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Watch mode
npm run test:watch
```

### Writing Tests

- Write unit tests for all new agent logic
- Add E2E tests for new user flows
- Aim for >80% code coverage
- Test edge cases and error conditions

**Example unit test:**
```typescript
describe('ProgressiveOverloadEngine', () => {
  it('should increase load when RPE is low', () => {
    const engine = new ProgressiveOverloadEngine(mockPrisma)
    const result = engine.determineProgression(lowRPEHistory)
    expect(result.method).toBe('increase_load')
  })
})
```

## Project Structure

Understanding the codebase:

```
astral-power/
├── app/              # Next.js 14 app directory
│   ├── api/          # API routes
│   └── [pages]/      # Page components
├── components/       # React components
├── lib/              # Core business logic
│   ├── agents/       # Agent implementations
│   └── types.ts      # Shared TypeScript types
├── prisma/           # Database schema and migrations
└── test/             # Test files
```

## Documentation

When adding new features:

- Update README.md if user-facing
- Add JSDoc comments to exported functions
- Update type definitions
- Add examples to DEPLOYMENT.md if needed

## Performance Considerations

- Keep bundle size small (lazy load heavy components)
- Optimize database queries (use indexes, limit results)
- Cache API responses where appropriate
- Use React.memo for expensive components

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain good color contrast

## Questions?

Feel free to:
- Open an issue with the `question` label
- Reach out on discussions

## Recognition

Contributors will be added to the README contributors section. Thank you for your contributions!

---

**Happy coding! 💪**

