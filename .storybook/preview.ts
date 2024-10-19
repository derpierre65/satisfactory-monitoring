import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
import 'quasar/dist/quasar.sass';
import '@/css/app.scss';
import {Preview, setup} from '@storybook/vue3';
import {createPinia} from 'pinia';
import {Quasar, useQuasar} from 'quasar';
import quasarUserOptions from '../.quasar/dev-spa/quasar-user-options';

setup(async (app) => {
  app.use(Quasar, quasarUserOptions);
  app.use(createPinia());

  return Promise
    .all([
      import('src/boot/axios'),
      import('src/boot/quasar'),
    ])
    .then(async (files) => {
      const functions = files.map(file => file.default).filter(file => typeof file === 'function');
      for (const func of functions) {
        await func({app});
      }
    });
});

const preview: Preview = {
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      include: /^.*/,
      expanded: true,
      sort: 'requiredFirst',
    },
  },
  decorators: [
    (story) => ({
      components: {story},
      setup() {
        const q = useQuasar();
        q.dark.set(true);
      },
      template: '<story />',
    }),
  ],
};

const tags = ['autodocs'];

export {
  preview as default,
  tags,
};
