import { SwitchObject } from '@derpierre65/ficsit-remote-monitoring';
import useServerStore from 'stores/server.ts';
import useDataStore from 'stores/data.ts';

async function switchAll(powerSwitches: SwitchObject[], status: boolean) {
  const serverStore = useServerStore();
  const dataStore = useDataStore();

  return serverStore
    .post('setSwitches', powerSwitches.map((powerSwitch) => ({
      ID: powerSwitch.ID,
      status,
    })))
    .then(() => dataStore.fetch('getSwitches', true));
}

async function toggleSwitchStatus(powerSwitch: SwitchObject) {
  const serverStore = useServerStore();
  const dataStore = useDataStore();

  return serverStore
    .post('setSwitches', {
      ID: powerSwitch.ID,
      status: !powerSwitch.IsOn,
    })
    .then(() => dataStore.fetch('getSwitches', true));
}

async function updateSwitchName(powerSwitch: SwitchObject, name: string) {
  const serverStore = useServerStore();
  const dataStore = useDataStore();

  return serverStore
    .post('setSwitches', {
      ID: powerSwitch.ID,
      name,
    })
    .then(() => dataStore.fetch('getSwitches', true));
}

async function updateSwitchPriority(powerSwitch: SwitchObject, priority: number) {
  const serverStore = useServerStore();
  const dataStore = useDataStore();

  return serverStore
    .post('setSwitches', {
      ID: powerSwitch.ID,
      priority,
    })
    .then(() => dataStore.fetch('getSwitches', true));
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
  toggleSwitchStatus,
  updateSwitchPriority,
  updateSwitchName,
  switchAll,
};
