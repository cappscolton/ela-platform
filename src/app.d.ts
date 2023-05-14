// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: import("lucia-auth").AuthRequest;
    }
    // interface PageData {}
    interface Platform {
      env: {
        KV_CACHE: KVNamespace;
        DATABASE_URL: string;
        DIRECT_DB_URL: string;
        BASE_PLATFORM_URL: string;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

/// <reference types="lucia-auth" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/server/lucia.ts").Auth;
    type UserAttributes = {};
  }
}

export {};
