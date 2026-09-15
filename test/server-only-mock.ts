// Test-only stub for the `server-only` package.
// The real package throws when imported from a client bundle; under vitest's
// jsdom environment that guard would fire even for legitimate server-module
// unit tests, so we alias it to a no-op here (see vitest.config.ts).
export {};
