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

function getPowerSwitchMapIconClasses(powerSwitch: SwitchObject) {
  const classes = [ 'tw-rounded-full', ];
  if (powerSwitch.IsOn) {
    classes.push('tw-bg-green-500');
  }
  else {
    classes.push('tw-bg-red-500');
  }

  return classes.join(' ');
}

export {
  getPowerSwitchMapIconClasses,
  switchAll,
};
