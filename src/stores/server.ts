import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Dialog, Loading } from 'quasar';
import router from 'src/router';
import { GetModListResponse } from '@derpierre65/ficsit-remote-monitoring';
import axios from 'axios';
import i18next from 'i18next';

type ServerInfo = {
  name: string;
  url: string;
  authToken: string;
};

const iconAliases: Record<string, string> = {
  BP_Crystal_C: '/assets/map/power_slug_blue.png',
  BP_Crystal_mk2_C: '/assets/map/power_slug_yellow.png',
  BP_Crystal_mk3_C: '/assets/map/power_slug_purple.png',
};

const iconRename = [
  'BP_Explorer_C',
  'BP_Truck_C',
  'BP_Golfcart_C',
  'BP_Tractor_C',
];

const useServerStore = defineStore('server', () => {
  const servers = ref<ServerInfo[]>([]);
  const isConnected = ref(false);
  const selected = ref(-1);

  (() => {
    const serverJson = window.localStorage.getItem('sm_servers') as string | null;
    const lastSelectedServer = parseInt(window.localStorage.getItem('sm_selected_server') || '-1');
    if (typeof serverJson === 'string') {
      servers.value = JSON.parse(serverJson);
    }

    selected.value = lastSelectedServer;
  })();

  function add(server: ServerInfo) {
    const lcServerUrl = server.url.toLowerCase();
    let index = servers.value.findIndex(({ url, }) => {
      return url.toLowerCase() === lcServerUrl;
    });

    if (index === -1) {
      index = servers.value.push(server) - 1;
    }
    else {
      servers.value[index] = server;
    }

    window.localStorage.setItem('sm_servers', JSON.stringify(servers.value));

    return index;
  }

  async function select(index: number) {
    if (index === -1) {
      await router.push({
        name: 'login',
      });
    }

    if (index >= -1 && index < servers.value.length) {
      selected.value = index;

      window.localStorage.setItem('sm_selected_server', selected.value.toString());
    }
  }

  function isSameVersionNumber(version?: string, requiredVersion?: string) {
    if (requiredVersion === '*') {
      return true;
    }

    return version === requiredVersion;
  }

  function tryConnect(server: ServerInfo) {
    Loading.show({
      group: 'tryConnect',
      message: 'Try to connect to the server...',
    });

    return axios.get<GetModListResponse>('getModList', {
      baseURL: server.url,
    })
      .then(({ data, }) => {
        const frmMod = data.find((mod) => mod.SMRName === 'FicsitRemoteMonitoring')!;
        if (import.meta.env.DEV) {
          return true;
        }

        const [ modMajor, modMinor, modPatch, ] = frmMod.Version.split('.');
        const requiredVersions = import.meta.env.VITE_REQUIRED_FRM_MOD.split(',');
        for (const version of requiredVersions) {
          const [ major, minor, patch, ] = version.split('.');
          if (isSameVersionNumber(modMajor, major) && isSameVersionNumber(modMinor, minor) && isSameVersionNumber(modPatch, patch)) {
            return true;
          }
        }

        Dialog.create({
          message: `${i18next.t('connecting.wrong_version', {
            versions: requiredVersions.join(', '),
          })}<br>
          ${i18next.t('connecting.installed_version', {
            version: frmMod.Version,
          })}`,
          html: true,
          class: 'shadow-0',
        });

        return false;
      })
      .catch(() => {
        Dialog.create({
          message: `Can't connect to ${server.url}`,
          class: 'shadow-0',
        });

        return false;
      })
      .finally(() => {
        Loading.hide('tryConnect');
      });
  }

  function post(path: string, data: object) {
    return axios.post(path, data, {
      baseURL: currentServer.value!.url!,
      headers: {
        Authorization: currentServer.value!.authToken,
      },
    }).then(({ data, }) => data);
  }

  function getItemUrl(className: string) {
    if (iconAliases[className]) {
      return iconAliases[className];
    }

    let fileName = className.replace('Build_', 'Desc_');
    if (iconRename.some((name) => name === className)) {
      fileName = fileName.replace('BP_', 'Desc_');
    }

    return `${currentServer.value?.url}/Icons/${fileName}.png`;
  }

  const currentApiUrl = computed(() => currentServer.value?.url || '');

  const currentServer = computed(() => {
    if (selected.value === -1) {
      return null;
    }

    return servers.value[selected.value];
  });

  const selectableServer = computed(() => {
    return servers.value.map((server, index) => ({
      value: index,
      label: `${server.name}`,
    }));
  });

  watch(servers, () => {
    window.localStorage.setItem('sm_servers', JSON.stringify(servers.value));
  }, {
    deep: true,
  });

  return {
    selectableServer,
    selected,
    servers,
    currentServer,
    isConnected,
    currentApiUrl,
    getItemUrl,
    add,
    post,
    select,
    tryConnect,
  };
});

export {
  useServerStore as default,
  type ServerInfo,
};
