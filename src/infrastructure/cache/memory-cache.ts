import ICache from '../../interfaces/cache'

interface CacheEntry<T> {
  value: T
  expiresAt: number | null
}

export default class MemoryCache implements ICache {
  private store = new Map<string, CacheEntry<unknown>>()

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (!entry) return null
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      await this.del(key)
      return null
    }
    return entry.value
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    this.store.set(key, { value, expiresAt })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  async delPattern(pattern: string): Promise<void> {
    const regex = this.patternToRegex(pattern)
    const keysToDelete: string[] = []
    for (const key of this.store.keys()) {
      if (regex.test(key)) keysToDelete.push(key)
    }
    for (const key of keysToDelete) {
      this.store.delete(key)
    }
  }

  private patternToRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regexStr = escaped.replace(/\*/g, '.*')
    return new RegExp(`^${regexStr}$`)
  }
}
