# SW Starter Task - Solution 2

A Next.js application built with TypeScript, Drizzle ORM, SQLite, BullMQ, and Redis.

This solution implements an event-driven architecture with a message queue system that automatically recomputes statistics every 5 minutes.

## Prerequisites

### For Local Development
- **Node.js** (version 18 or higher)
- **pnpm** (version 10.24.0 or higher)
  - Install globally: `npm install -g pnpm@10.24.0`
- **Redis** (version 7 or higher)
  - Required for the BullMQ queue system
  - Install: `brew install redis` (macOS) or `sudo apt-get install redis-server` (Linux)
  - Or use Docker: `docker run -d -p 6379:6379 redis:7-alpine`

### For Docker
- **Docker** (latest version)
- **Docker Compose** (recommended, includes Redis)

## Running Locally

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Redis

Make sure Redis is running locally:

```bash
# macOS (if installed via Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Or using Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### 3. Set Up Database

Create the database directory and run migrations:

```bash
mkdir -p data
pnpm db:migrate
```

### 4. Start Development Server

In one terminal, start the Next.js app:

```bash
pnpm dev
```

### 5. Start the Worker Process

In a separate terminal, start the BullMQ worker:

```bash
pnpm worker
```

The application will be available at [http://localhost:3000](http://localhost:3000).

**Important:** Both the Next.js app and the worker process must be running for the statistics computation to work properly.

### 4. Build for Production (Optional)

```bash
pnpm build
pnpm start
```

## Running with Docker

### Option 1: Using Docker Build and Run

1. **Build the Docker image:**

```bash
docker build -t swstarter-task .
```

2. **Run the container:**

```bash
docker run -p 3000:3000 swstarter-task
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Option 2: Using Docker Compose

Simply run:

```bash
docker-compose up --build
```

Or to run in detached mode:

```bash
docker-compose up -d --build
```

To stop the container:

```bash
docker-compose down
```

The `docker-compose.yml` file includes:
- **Redis service** - Message queue backend for BullMQ
- **App service** - Next.js application
- Automatic build from the Dockerfile
- Port mapping (3000:3000 for app, 6379:6379 for Redis)
- Volume mount for the database directory (persists data between restarts)
- Automatic restart policy

**Note:** When using Docker Compose, you'll still need to run the worker process separately. The worker can be run:
- Inside a separate container (add to docker-compose.yml)
- On the host machine (connecting to the Redis container)
- As a separate process in the same container (not recommended for production)

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm worker` - Start the BullMQ worker process (runs statistics computation jobs)
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Architecture

### Event-Driven Statistics Computation

This solution uses **BullMQ** with **Redis** to implement an event-driven architecture:

1. **Next.js App** - Registers a repeatable job on startup that runs every 5 minutes
2. **BullMQ Worker** - Runs as a separate process, processes jobs from the queue
3. **Redis** - Shared message queue between the app and worker
4. **Database** - Stores pre-computed statistics for fast API responses

### How It Works

1. When the Next.js app starts, it registers a repeatable cron job (every 5 minutes)
2. The worker process listens for jobs in the queue
3. Every 5 minutes, a job is automatically enqueued
4. The worker processes the job, computes statistics, and stores them in the database
5. The API endpoint returns the pre-computed statistics (fast response)

### Queue Registration

The repeatable job is automatically registered when the Next.js app starts via the `instrumentation.ts` hook.

## Database

The application uses SQLite with Drizzle ORM. The database file is stored in the `data/database.db` directory.

### Tables

- `request_timings` - Stores individual request timing data
- `hourly_statistics` - Aggregated hourly request counts
- `computed_statistics` - Pre-computed statistics (updated every 5 minutes by the worker)

### Database Management

- **View database:** Run `pnpm db:studio` to open Drizzle Studio in your browser
- **Create migrations:** After schema changes, run `pnpm db:generate`
- **Apply migrations:** Run `pnpm db:migrate` to apply pending migrations

## Project Structure

```
swstarter-task/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── statistics/    # Statistics endpoint
│   │   └── queue/         # Queue management endpoints
│   └── ...
├── data/                   # Database files
├── drizzle/                # Database migrations
├── lib/                    # Utility functions and database setup
│   ├── queue.ts           # BullMQ queue setup
│   ├── queue-init.ts      # Queue initialization
│   ├── statistics-computation.ts # Statistics computation logic
│   └── ...
├── worker.ts              # BullMQ worker process (runs separately)
├── instrumentation.ts     # Next.js instrumentation hook
├── public/                # Static assets
├── Dockerfile             # Docker configuration
└── docker-compose.yml     # Docker Compose configuration (includes Redis)
```

## Environment Variables

- `REDIS_URL` - Redis connection URL (default: `redis://localhost:6379`)
- `NODE_ENV` - Set to `production` for production mode

## Notes

- The database directory (`data/`) is excluded from Docker builds via `.dockerignore`
- The Dockerfile installs pnpm globally and runs migrations during the build process
- Port 3000 is exposed by default for the Next.js app
- Port 6379 is exposed by default for Redis (when using Docker Compose)
- The worker process must be running separately from the Next.js app
- Statistics are automatically recomputed every 5 minutes via the BullMQ queue
- The API endpoint returns pre-computed statistics for fast responses
