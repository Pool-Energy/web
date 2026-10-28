import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        // @xterm/xterm ships CommonJS; it must be processed by Vite so that
        // its named exports (e.g. `Terminal`) resolve under Node ESM.
        inline: ['@xterm/xterm', 'ng-terminal'],
        fallbackCJS: true,
      },
    },
  },
});
