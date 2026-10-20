# Geniusphere Testing Strategy & Quality Assurance Framework

## 1. Testing Pyramid Overview
- **Curriculum & Manifest Integrity Tests:** Assert that all 17 canonical topics exist, each with exactly 10 video lessons and 10 interactive simulation labs. Assert that all YouTube video IDs are valid and not placeholders.
- **Simulation Math & Algorithm Tests:** Verify calculations, formulas, boundary conditions, and state transitions across representative simulation labs.
- **API & Security Tests:** Exercise JWT authentication, password hashing, organization isolation, and RLS policy boundaries.
- **Production Integration Tests:** Run real queries against PostgreSQL pools, transactions, and WebSocket connections (`tests/production-integration.test.ts`).

## 2. Test Execution Commands
- Run complete test suite: `npm test`
- Run integration tests: `npm run test:integration`
- Type check: `npx tsc --noEmit`
