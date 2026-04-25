import { PGlite } from '@electric-sql/pglite';

// Initialize a singleton instance of PGLite persisting to IndexedDB
export const db = new PGlite('idb://koa-local-db');
