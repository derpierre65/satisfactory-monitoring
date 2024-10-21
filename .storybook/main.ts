import {StorybookConfig} from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import {quasar, transformAssetUrls} from '@quasar/vite-plugin';
import path from 'path';
import {type PluginOption} from 'vite';
//import * as hq from 'alias-hq';

export default {
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: 'vue-component-meta',
      tsconfig: 'tsconfig.json',
    },
  },
  stories: ['../src/**/*.stories.ts',],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    'storybook-addon-vue-slots',
  ],
  core: {
    disableTelemetry: true,
  },
  viteFinal(config) {
    config.plugins.push(...[
      vue({
        template: {transformAssetUrls},
      }),
      quasar({
        sassVariables: 'src/css/quasar.variables.scss',
      }),
    ]);

    config.resolve.alias = {
      ...config.resolve.alias,
      ...{
        '@': path.resolve(__dirname, '../src'),
        'src': path.resolve(__dirname, '../src'),
        'app': path.resolve(__dirname, '../src/components'),
        'components': path.resolve(__dirname, '../src/components'),
        'layouts': path.resolve(__dirname, '../src/layouts'),
        'pages': path.resolve(__dirname, '../src/pages'),
        'assets': path.resolve(__dirname, '../src/assets'),
        'boot': path.resolve(__dirname, '../src/boot'),
        'stores': path.resolve(__dirname, '../src/stores'),
      },
    };

    return config;
  },
} as StorybookConfig;
