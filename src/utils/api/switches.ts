import { SwitchObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import useDataStore from 'stores/data.ts';

function switchAll(powerSwitches: SwitchObject[], status: boolean) {
  const serverStore = useServerStore();
  const dataStore = useDataStore();

  serverStore.post('setSwitches', powerSwitches.map((powerSwitch) => ({
    ID: powerSwitch.ID,
    status,
  }
  ))).then(() => dataStore.fetch('getSwitches', true));
}

export {
  switchAll,
};
