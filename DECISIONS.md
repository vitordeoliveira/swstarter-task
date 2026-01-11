# Architecture Decisions

This document records the key architectural decisions made for this project.

## 1. Use SQLite

**Decision:** Use SQLite as the database solution.

**Rationale:**
- **Simplicity:** SQLite is a file-based database that requires no separate server process, making it ideal for development and small-to-medium scale applications
- **Zero Configuration:** No need to set up and manage a separate database server, reducing operational complexity
- **Portability:** The database is a single file that can be easily backed up, moved, or versioned
- **Performance:** For read-heavy workloads and moderate write operations, SQLite provides excellent performance
- **Development Experience:** Perfect for local development, testing, and prototyping without requiring additional infrastructure

**Trade-offs:**
- **Concurrency:** SQLite has limitations with concurrent writes, which may not be suitable for high-traffic applications with many simultaneous write operations
- **Scalability:** Not designed for distributed systems or applications requiring horizontal scaling
- **Features:** Lacks some advanced features found in PostgreSQL or MySQL (e.g., full-text search, advanced indexing options)

**Alternatives Considered:**
- PostgreSQL: More robust for production but requires additional infrastructure
- MySQL: Similar to PostgreSQL, adds operational overhead
- MongoDB: NoSQL option, but SQLite's relational model was preferred for this use case

## 2. Next.js for Fullstack Development

**Decision:** Use Next.js as the fullstack framework.

**Rationale:**
- **Unified Framework:** Next.js provides both frontend and backend capabilities in a single framework, reducing context switching and simplifying the development workflow
- **API Routes:** Built-in API routes allow creating backend endpoints without setting up a separate server
- **Type Safety:** Full TypeScript support across frontend and backend code
- **Developer Experience:** Excellent tooling, hot reload, and built-in optimizations (code splitting, image optimization, etc.)
- **Server-Side Rendering (SSR):** Built-in support for SSR and Static Site Generation (SSG), improving performance and SEO
- **React Ecosystem:** Leverages the React ecosystem while providing additional features for production-ready applications
- **Deployment:** Easy deployment options with Vercel and other platforms

**Trade-offs:**
- **Framework Lock-in:** Committed to Next.js and React ecosystem
- **Learning Curve:** Requires understanding both React and Next.js-specific concepts
- **Flexibility:** Less flexibility compared to separate frontend/backend architectures for certain use cases

**Alternatives Considered:**
- **Separate Frontend/Backend:** Using React + Express/FastAPI, but adds complexity in managing two separate applications
- **Remix:** Similar fullstack framework, but Next.js has larger ecosystem and community
- **SvelteKit:** Different paradigm, but team familiarity with React was a factor

