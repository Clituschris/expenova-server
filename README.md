# API

Fastify + TypeScript REST API with PostgreSQL (Supabase), deployed on Render.

## Stack

| Layer | Package | Why |
|-------|---------|-----|
| Framework | [Fastify](https://fastify.dev) | Fast, low overhead |
| DB client | [postgres](https://github.com/porsager/postgres) | Lightweight SQL template tag, no ORM bloat |
| Migrations | [node-pg-migrate](https://salsita.github.io/node-pg-migrate/) | Simple, TypeScript-native |

## Branch → Environment mapping

| Branch | Environment | Supabase project | Render project |
|--------|-------------|-----------------|----------------|
| `stage` | Staging | `your-stage-project` | `api-stage` |
| `main` | Production | `your-prod-project` | `api-prod` |

## Local setup

```bash
cp .env.example .env
# Fill in DATABASE_URL with your local or Supabase stage DB

npm install
npm run migrate     # run migrations
npm run dev         # start dev server at http://localhost:3000
```

## Running migrations manually

```bash
# Up (apply pending)
npm run migrate

# Down (roll back one)
npm run migrate:down

# Create new migration
npm run migrate:create -- my-migration-name
```

## GitHub Secrets required

| Secret | Description |
|--------|-------------|
| `STAGE_DATABASE_URL` | Supabase connection string for stage |
| `PROD_DATABASE_URL` | Supabase connection string for prod |
| `STAGE_RENDER_DEPLOY_HOOK` | Render deploy hook URL for stage service |
| `PROD_RENDER_DEPLOY_HOOK` | Render deploy hook URL for prod service |

### Getting these values

**Supabase DATABASE_URL**: Project → Settings → Database → Connection string (URI)  
Use the **Transaction pooler** URL (port 6543) for serverless/edge, or the direct URL (port 5432) for a persistent server like Render.

**Render Deploy Hook**: Service → Settings → Deploy Hook → Copy URL

## CI/CD flow

```
push to any branch  →  CI (lint + typecheck + test)
push to stage       →  CI + migrate stage DB + deploy to Render stage
push to main        →  CI + typecheck + migrate prod DB + deploy to Render prod
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user |
| DELETE | `/users/:id` | Delete user |
