# SW Starter Task

A Next.js application built with TypeScript, Drizzle ORM, and SQLite.

## Prerequisites

### For Local Development
- **Node.js** (version 18 or higher)
- **pnpm** (version 10.24.0 or higher)
  - Install globally: `npm install -g pnpm@10.24.0`

### For Docker
- **Docker** (latest version)
- **Docker Compose** (optional, if using docker-compose)

## Running Locally

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Database

Create the database directory and run migrations:

```bash
mkdir -p data
pnpm db:migrate
```

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

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
- Automatic build from the Dockerfile
- Port mapping (3000:3000)
- Volume mount for the database directory (persists data between restarts)
- Automatic restart policy

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Database

The application uses SQLite with Drizzle ORM. The database file is stored in the `data/database.db` directory.

### Database Management

- **View database:** Run `pnpm db:studio` to open Drizzle Studio in your browser
- **Create migrations:** After schema changes, run `pnpm db:generate`
- **Apply migrations:** Run `pnpm db:migrate` to apply pending migrations

## Project Structure

```
swstarter-task/
├── app/              # Next.js app directory
├── data/             # Database files
├── drizzle/          # Database migrations
├── lib/              # Utility functions and database setup
├── public/           # Static assets
├── Dockerfile        # Docker configuration
└── docker-compose.yml # Docker Compose configuration
```

## Notes

- The database directory (`data/`) is excluded from Docker builds via `.dockerignore`
- The Dockerfile installs pnpm globally and runs migrations during the build process
- Port 3000 is exposed by default
