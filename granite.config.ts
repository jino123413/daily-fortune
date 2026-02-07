import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'daily-fortune',
  web: {
    host: '0.0.0.0',
    port: 3005,
    commands: {
      dev: 'rsbuild dev --host',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: '오늘의 운세',
    icon: 'https://raw.githubusercontent.com/jino123413/app-logos/master/daily-fortune.png',
    primaryColor: '#6C3CE1',
    bridgeColorMode: 'inverted',
  },
  webViewProps: {
    type: 'partner',
  },
});
