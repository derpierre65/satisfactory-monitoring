import { registerWidget } from 'src/utils/dashboard/widgets';
import { computed, defineAsyncComponent } from 'vue';
import useDataStore from 'stores/data';
import { GetPlayerResponse } from '@derpierre65/ficsit-remote-monitoring';
import i18next from 'i18next';
import { ConfigurationData } from 'src/utils/dashboard/configuration';

export default function registerInventoryWidgets() {
  registerWidget({
    id: 'inventory_player',
    component: defineAsyncComponent(() => import('components/widgets/inventories/PlayerInventory.vue')),
    category: 'inventory',
    layoutInfo: {
      minW: 7,
      minH: 8,
    },
    configuration: [
      {
        id: 'playerId',
        label: 'dashboard.widgets.inventory_player.configuration.player',
        required: true,
        type: 'select',
        fromEndpoint: 'getPlayer',
        optionValue: 'ID',
        optionLabel: (powerSwitch) => powerSwitch.Name || i18next.t('dashboard.widgets.inventory_player.unknown_player'),
      },
      {
        id: 'hideHeader',
        label: 'dashboard.widgets.inventory_player.configuration.hide_header',
        type: 'boolean',
      },
    ],
    endpoints: [ 'getPlayer', ],
    isValid(configuration) {
      const dataStore = useDataStore();
      const players = dataStore.apiData.getPlayer as GetPlayerResponse;
      if (!players) {
        return null;
      }

      return players.some((powerSwitch) => powerSwitch.ID === configuration.playerId);
    },
    props(configuration: ConfigurationData) {
      const dataStore = useDataStore();

      return computed(() => {
        const getPlayer = dataStore.apiData.getPlayer as GetPlayerResponse;
        const item = getPlayer?.find((player) => player.ID === configuration.playerId);
        if (!item) {
          return null;
        }

        return {
          hideHeader: configuration.hideHeader,
          item,
        };
      });
    },
  });
}
