import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import FRM from 'src/utils/FRM.ts';
import { Dialog, Loading } from 'quasar';

type ServerInfo = {
  name: string;
  url: string;
};

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

    window.localStorage.setItem('sm_servers', JSON.stringify(servers.value));

    return index;
  }

  function select(index: number) {
    if (index >= -1 && index < servers.value.length) {
      selected.value = index;

      window.localStorage.setItem('sm_selected_server', selected.value.toString());
    }
  }

  function tryConnect(server: ServerInfo) {
    Loading.show({
      group: 'tryConnect',
      message: 'Try to connect to the server...',
    });

    return new FRM(server).getModList()
      .then(() => true)
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

  return {
    selectableServer,
    selected,
    servers,
    currentServer,
    isConnected,
    add,
    select,
    tryConnect,
  };
});

export {
  useServerStore as default,
  type ServerInfo,
};
