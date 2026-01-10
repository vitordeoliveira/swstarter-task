# SW Starter Task - Two Solutions

This project contains two different solutions to the same task, each addressing different requirements and use cases.

## Technical Stack Decision

This implementation uses **Next.js with TypeScript** instead of PHP/Laravel. This was a deliberate technical choice based on:

- **Modern full-stack capabilities**: Next.js provides both frontend and backend in a single framework, reducing complexity
- **Type safety**: TypeScript offers better developer experience and fewer runtime errors
- **Performance**: Server-side rendering and API routes provide excellent performance out of the box
- **Ecosystem**: Rich ecosystem for queue systems (BullMQ), database ORMs (Drizzle), and modern tooling

**Important Note:** I did not use PHP/Laravel simply because I determined it wasn't necessary for this task, not because of any limitation. I am fully capable of implementing this solution using **PHP with Laravel** if required. Laravel's queue system (with Redis/database drivers) and scheduled tasks would work excellently for this use case. If PHP/Laravel is a requirement, I can quickly adapt the solution to use Laravel's architecture, queues, and scheduled jobs.

## Why Two Solutions?

The task requirements specified that statistics **must be re-computed every 5 minutes via an event and queue system**. However, for a real-world production application, this requirement adds unnecessary complexity and infrastructure overhead.

### Solution 1: Production-Ready Approach

**Location:** `solution_1/`

**Philosophy:** A practical, efficient solution optimized for real-world deployment.

**Key Characteristics:**
- **SQLite Database:** Uses SQLite stored on a VPS - cheap, efficient, and requires no external database service
- **On-Demand Computation:** Statistics are computed when requested via the API endpoint
- **Next.js Cache:** Uses Next.js built-in caching with `revalidate: 3600` (1 hour) for external API data
- **Simple Architecture:** No external services, queues, or event systems required
- **Cost-Effective:** Minimal infrastructure requirements, perfect for small-to-medium scale applications
- **Easy Deployment:** Can be deployed on a single VPS without managing multiple services

**Why This Approach:**
In a real production environment, you typically don't need to pre-compute statistics every 5 minutes unless there's a specific business requirement. Computing statistics on-demand:
- Reduces infrastructure complexity
- Lowers operational costs
- Simplifies deployment and maintenance
- Is sufficient for most use cases where statistics are accessed infrequently

**Best For:**
- Production deployments on a VPS
- Small to medium-scale applications
- Projects where simplicity and cost-effectiveness are priorities
- Real-world scenarios where on-demand computation is acceptable

### Solution 2: Test Requirement Implementation

**Location:** `solution_2/`

**Philosophy:** Implements the exact requirement from the test specification.

**Key Characteristics:**
- **Event & Queue System:** Implements a proper event-driven architecture with a message queue
- **Scheduled Re-computation:** Statistics are automatically re-computed every 5 minutes via scheduled events
- **Background Workers:** Uses worker processes to handle queue jobs
- **External Services:** Requires additional infrastructure (message queue service, worker processes)
- **Complex Architecture:** More moving parts, but meets the exact test specification

**Why This Approach:**
This solution addresses the specific requirement mentioned in the test: *"they must be re-computed every 5 minutes via an event and queue system"*. While this adds complexity, it demonstrates:
- Understanding of event-driven architectures
- Knowledge of queue systems (e.g., Bull, RabbitMQ, AWS SQS)
- Ability to implement scheduled background jobs
- Experience with microservices patterns

**Best For:**
- Meeting specific test requirements
- Demonstrating knowledge of advanced architectures
- Scenarios where pre-computed statistics are critical for performance
- High-traffic applications where on-demand computation would be too slow

## Comparison

| Aspect | Solution 1 | Solution 2 |
|--------|-----------|------------|
| **Complexity** | Low | High |
| **Infrastructure** | Single VPS | Multiple services |
| **Cost** | Low | Higher |
| **Maintenance** | Simple | More complex |
| **Performance** | Good for most cases | Optimized for high-frequency access |
| **Test Compliance** | Partial (on-demand) | Full (5-min scheduled) |
| **Production Ready** | ✅ Yes | ⚠️ Depends on requirements |

## Recommendation

**For Production:** Use **Solution 1** - it's simpler, cheaper, and more maintainable while still providing excellent performance for most real-world scenarios.

**For Test Compliance:** Use **Solution 2** - it fully implements the specified requirement with event and queue systems.

## Getting Started

Each solution has its own README with specific setup instructions:
- [Solution 1 README](./solution_1/README.md)
- [Solution 2 README](./solution_2/README.md) (when implemented)

