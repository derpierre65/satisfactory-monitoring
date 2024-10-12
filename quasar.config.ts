import { configure } from 'quasar/wrappers';

export default configure((/* ctx */) => {
  return {
    boot: [
      'axios',
      'quasar',
      'load-server',
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: [ 'app.scss', ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [ 'fontawesome-v6', ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: [
          'es2022',
          'firefox115',
          'chrome115',
          'safari14',
        ],
        node: 'node20',
      },
      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup
      vitePlugins: [],
    },

    devServer: {
      open: false,
    },

    framework: {
      config: {},
      iconSet: 'fontawesome-v6',
      // lang: 'en-US', // Quasar language pack
      plugins: [
        'Loading',
        'Notify',
        'Dialog',
      ],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
    //   pwaServiceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    //   bexManifestFile: 'src-bex/manifest.json
    // },
  };
});
