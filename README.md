# Social Media Post Module API

A minimal Node.js/TypeScript backend that simulates core post-management functionality for a social media platform. Built with clean architecture principles.

## Features

- **Post Creation & Retrieval** – Create posts with user info (mocked IDs), text content, optional media references, timestamps, and unique identifiers. Data stored in a JSON file (no database).
- **Feed with Cursor-Based Pagination** – Aggregated feed from multiple users with stable, deterministic ordering and no duplicated or missing records.
- **Engagement Actions** – Like/Unlike, Comment (simple text), Share (counter).
- **Caching Layer** – In-memory cache for feed and engagement counts with proper invalidation.

## Setup

```bash
npm install
```

## Execution

```bash
# Development (with hot reload)
npm run dev

# Production build and run
npm run build
npm start
```

The API runs on port 3000 by default. Set `PORT` in `.env` to override.

## API Usage

### Create Post

```bash
POST /posts
Content-Type: application/json
X-User-Id: user-1  # Optional; defaults to user-1. Use user-1, user-2, or user-3

{
  "text": "Hello world!",
  "mediaRefs": ["https://example.com/image.jpg"]  # Optional
}
```

### Get Feed (Cursor-Based Pagination)

```bash
GET /posts?cursor=<postId>&limit=10
```

- `cursor` – ID of the last post from the previous page (omit for first page).
- `limit` – Number of posts per page (default: 10, max: 50).

Response:

```json
{
  "data": [...],
  "nextCursor": "uuid-or-null",
  "hasMore": true
}
```

### Get Single Post

```bash
GET /posts/:id
```

### Get Engagement Counts

```bash
GET /posts/:id/engagement
```

Returns `{ likes, comments, shares }`.

### Like Post

```bash
POST /posts/:id/like
X-User-Id: user-1
```

### Unlike Post

```bash
POST /posts/:id/unlike
X-User-Id: user-1
```

### Comment on Post

```bash
POST /posts/:id/comment
Content-Type: application/json
X-User-Id: user-1

{
  "text": "Great post!"
}
```

### Share Post

```bash
POST /posts/:id/share
```

## Assumptions

- **User IDs** – Mocked static IDs: `user-1`, `user-2`, `user-3`. Pass via `X-User-Id` header; defaults to `user-1` if missing or invalid.
- **Storage** – Posts stored in `data/posts.json`. Directory is created automatically.
- **No Authentication** – Per PDF scope; user identification is via mocked IDs only.
- **Comments** – Flat structure; nesting not required per PDF.
