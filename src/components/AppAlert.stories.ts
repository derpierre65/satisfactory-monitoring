import AppAlert from 'components/AppAlert.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const Meta: Meta<typeof AppAlert> = {
  component: AppAlert,
  title: 'AppAlert',
  parameters: {
    docs: {
      description: {
        component: 'hello',
      },
    },
    slots: {
      default: {
        description: 'Content of the alert message.',
        template: '<p>{{ args.default }}</p>',
      },
    },
  },
  argTypes: {
    type: {
      options: [
        'info',
        'error',
        'success',
        'warning',
        'loading',
      ],
      control: {
        labels: {
          info: 'Information',
          error: 'Error',
          success: 'Success',
          warning: 'Warning',
          loading: 'Loading',
        },
        type: 'select',
      },
    },
  },
};

const DefaultArgs: StoryObj<typeof AppAlert>['args'] = {
  default: 'Hello World',
  dense: true,
  text: false,
};

const Error: StoryObj<typeof AppAlert> = {
  args: {
    ...DefaultArgs,
    type: 'error',
  },
};

const Info = {
  args: {
    ...DefaultArgs,
    type: 'info',
  },
};

const Warning = {
  args: {
    ...DefaultArgs,
    type: 'warning',
  },
};

const Success = {
  args: {
    ...DefaultArgs,
    type: 'success',
  },
};

const Loading = {
  args: {
    ...DefaultArgs,
    type: 'loading',
  },
};

export {
  Meta as default,
  Success,
  Error,
  Loading,
  Info,
  Warning,
};
