import { QSelectProps } from 'quasar';

type CustomConfigurationItem = {
  id: string;
  label: string;
  required?: boolean;
} & ({
  type: 'select';
  fromEndpoint: string;
  optionValue: QSelectProps['optionValue'];
  optionLabel: QSelectProps['optionLabel'];
  options?: QSelectProps['options'];
} | {
  type: 'boolean';
});

export {
  type CustomConfigurationItem,
};
