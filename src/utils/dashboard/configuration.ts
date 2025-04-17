import { Dialog, Loading, QInput, QSelectProps } from 'quasar';
import useDataStore from 'stores/data';
import CustomConfigurationDialog from 'components/dashboard/CustomConfigurationDialog.vue';

type CustomConfigurationItem = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
} & ({
  type: 'select';
  fromEndpoint: string;
  optionValue: QSelectProps['optionValue'];
  optionLabel: QSelectProps['optionLabel'];
  options?: QSelectProps['options'];
} | {
  type: 'boolean';
} | {
  type: 'text';
  props?: Partial<QInput>;
});

type ConfigurationData = Record<string, string | number | boolean>;

async function openEditConfigurationDialog(configurations: CustomConfigurationItem[] | null = null, settings: ConfigurationData = {}) {
  if (!configurations || !configurations.length) {
    return {
      onOk: (cb: (data: ConfigurationData) => void) => cb({} as ConfigurationData),
    };
  }

  const dataStore = useDataStore();

  Loading.show({
    group: 'openEditConfigurationDialog',
  });

  try {
    const fetchEndpoints: string[] = [];
    for (const configuration of configurations) {
      if (configuration.type === 'select' && configuration.fromEndpoint) {
        if (!fetchEndpoints.includes(configuration.fromEndpoint)) {
          fetchEndpoints.push(configuration.fromEndpoint);
        }
      }

      if (typeof configuration.defaultValue !== 'undefined') {
        settings[configuration.id] = configuration.defaultValue;
      }

      if (configuration.type === 'boolean' && typeof settings[configuration.id] === 'undefined') {
        settings[configuration.id] = false;
      }
    }

    await dataStore.fetch(fetchEndpoints, true, true);
  }
  catch (error) {
    console.error(error);

    return {
      onOk: () => null,
    };
  }
  finally {
    Loading.hide('openEditConfigurationDialog');
  }

  return Dialog.create({
    component: CustomConfigurationDialog,
    componentProps: {
      defaultSettings: settings,
      configurations,
    },
  });
}

export {
  type CustomConfigurationItem,
  type ConfigurationData,
  openEditConfigurationDialog,
};
