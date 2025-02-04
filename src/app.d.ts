// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: Session | undefined;
    }
    // interface PageData {}
    interface Platform {
      env: {
        KV_CACHE: KVNamespace;
        DATABASE_URL: string;
        DIRECT_DB_URL: string;
        BASE_PLATFORM_URL: string;
        GITHUB_ID: string;
        GITHUB_SECRET: string;
        AUTH_SECRET: string;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
