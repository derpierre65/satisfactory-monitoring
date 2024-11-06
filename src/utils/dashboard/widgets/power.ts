import useDataStore from 'stores/data.ts';
import { GetSwitchesResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed, defineAsyncComponent } from 'vue';
import { registerWidget, WidgetConfigurationData } from 'src/utils/dashboard/widgets.ts';

export default function registerPowerWidgets() {
  registerWidget({
    id: 'power-switch-witcher',
    title: 'dashboard.widgets.power_switch_witcher.title',
    component: defineAsyncComponent(() => import('components/widgets/power-switch/PowerSwitchSwitcher.vue')),
    category: 'power',
    layoutInfo: {
      minW: 6,
      minH: 4,
      maxH: 5,
    },
    configuration: [
      {
        id: 'switchId',
        label: 'dashboard.widgets.power_switch_witcher.configuration.power_switch',
        required: true,
        type: 'select',
        fromEndpoint: 'getSwitches',
        optionValue: 'ID',
        optionLabel: (powerSwitch) => powerSwitch.Name || 'Unnamed Switch',
      },
    ],
    endpoints: [ 'getSwitches', ],
    isValid(configuration) {
      const dataStore = useDataStore();
      const switches = dataStore.apiData.getSwitches as GetSwitchesResponse;
      if (!switches) {
        return null;
      }

      return switches.some((powerSwitch) => powerSwitch.ID === configuration.switchId);
    },
    props(configuration: WidgetConfigurationData) {
      const dataStore = useDataStore();

      return computed(() => {
        const getSwitches = dataStore.apiData.getSwitches as GetSwitchesResponse;
        const item = getSwitches?.find((powerSwitch) => powerSwitch.ID === configuration.switchId);
        if (!item) {
          return null;
        }

        return {
          item,
        };
      });
    },
  });
}
