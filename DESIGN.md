# Design Notes

## Architecture

The project follows **Clean Architecture** with clear separation of concerns:

- **Entities** – Core domain models (`Post`, `PostComment`, etc.).
- **Use Cases** – Application business logic (create post, feed, like, comment, share).
- **Interfaces** – Contracts (DAO, cache).
- **Infrastructure** – Implementations: JSON file storage, in-memory cache, Express API.

Dependencies point inward: infrastructure depends on use cases and entities, not the reverse.

## Caching Strategy

- **Abstraction** – `ICache` interface with `get`, `set`, `del`, `delPattern`.
- **Implementation** – In-memory `MemoryCache` (Redis-like behavior).
- **Cached Data**:
  - Feed results: `feed:{cursor}:{limit}` (TTL 30s).
  - Single post: `post:{id}` (TTL 60s).
  - Engagement counts: `engagement:{id}` (TTL 60s).
- **Invalidation** – On create, like, unlike, comment, share: invalidate `post:{id}`, `engagement:{id}`, and all `feed:*` keys to avoid stale data.

## Pagination Strategy

- **Cursor-based** – Uses the post ID as the cursor.
- **Ordering** – Deterministic: `createdAt` DESC, then `id` ASC for tie-breaker.
- **Behavior** – Client passes `cursor` (last seen post ID) and `limit`. Server returns posts after that cursor. `nextCursor` is the ID of the last post in the response; `hasMore` indicates if more pages exist.
- **Consistency** – No offset-based drift; no duplicated or missing records across pages.

## Concurrency Strategy

- **JSON Storage** – Synchronous file reads/writes. For a single-process Node.js app, this is sufficient. No external DB means no connection pooling.
- **Scalability** – For multi-process or distributed deployment, replace `JsonPostDAO` with a proper store (e.g., PostgreSQL, Redis) and use the same `IPostDAO` interface.
- **Cache** – In-memory; per-process. For multi-instance setups, use Redis or similar for shared cache.
