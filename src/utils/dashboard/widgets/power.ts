import useDataStore from 'stores/data.ts';
import { GetSwitchesResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed, defineAsyncComponent } from 'vue';
import { registerWidget, WidgetConfigurationData } from 'src/utils/dashboard/widgets.ts';

export default function registerPowerWidgets() {
  registerWidget({
    id: 'power_switch_switcher',
    component: defineAsyncComponent(() => import('components/widgets/power-switch/PowerSwitchSwitcher.vue')),
    category: 'power',
    layoutInfo: {
      minW: 6,
      minH: 3,
    },
    configuration: [
      {
        id: 'switchId',
        label: 'dashboard.widgets.power_switch_switcher.configuration.power_switch',
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

  registerWidget({
    id: 'power_total_production',
    category: 'power',
    component: defineAsyncComponent(() => import('components/widgets/power/PowerTotalProduction.vue')),
    layoutInfo: {
      minW: 5,
      minH: 5,
    },
    props: {
      ignorePadding: true,
      class: 'text-center',
    },
  });

  registerWidget({
    id: 'power_current_consumption',
    category: 'power',
    component: defineAsyncComponent(() => import('components/widgets/power/PowerCurrentConsumption.vue')),
    layoutInfo: {
      minW: 6,
      minH: 5,
    },
    props: {
      ignorePadding: true,
      class: 'text-center',
    },
  });

  registerWidget({
    id: 'power_max_consumption',
    category: 'power',
    component: defineAsyncComponent(() => import('components/widgets/power/PowerMaxConsumption.vue')),
    layoutInfo: {
      minW: 6,
      minH: 5,
    },
    props: {
      ignorePadding: true,
      class: 'text-center',
    },
  });

  registerWidget({
    id: 'power_battery_capacity',
    category: 'power',
    component: defineAsyncComponent(() => import('components/widgets/power/PowerBatteryCapacity.vue')),
    layoutInfo: {
      minW: 6,
      minH: 5,
    },
    props: {
      ignorePadding: true,
      class: 'text-center',
    },
  });

  registerWidget({
    id: 'power_battery_time_full',
    category: 'power',
    component: defineAsyncComponent(() => import('components/widgets/power/PowerBatteryTimeFull.vue')),
    layoutInfo: {
      minW: 6,
      minH: 6,
    },
    props: {
      ignorePadding: true,
      class: 'text-center',
    },
  });

  registerWidget({
    id: 'power_battery_first_empty',
    category: 'power',
    component: defineAsyncComponent(() => import('components/widgets/power/PowerBatteryFirstEmpty.vue')),
    layoutInfo: {
      minW: 6,
      minH: 6,
    },
    props: {
      ignorePadding: true,
      class: 'text-center',
    },
  });
}
