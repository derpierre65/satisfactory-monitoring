import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import FRM from 'src/utils/FRM.ts';
import axios from 'axios';

type ServerInfo = {
  host: string;
  port: number;
};

const useServerStore = defineStore('server', () => {
  const servers = ref<ServerInfo[]>([]);
  const isConnected = ref(false);
  const host = ref('');
  const port = ref(0);
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
    const lcServerHost = server.host.toLowerCase();
    let index = servers.value.findIndex(({ host, port, }) => {
      return host.toLowerCase() === lcServerHost && port === server.port;
    });

    if (index === -1) {
      index = servers.value.push({
        host: server.host,
        port: server.port,
      }) - 1;
    }

    window.localStorage.setItem('sm_servers', JSON.stringify(servers.value));

    return index;
  }

  function select(index: number) {
    if (index >= -1 && index < servers.value.length) {
      selected.value = index;

      window.localStorage.setItem('sm_selected_server', selected.value);
    }
  }

  function tryConnect(server: ServerInfo) {
    axios.defaults.baseURL = `http://${server.host}:${server.port}`;

    return FRM.getModList()
      .then(() => true)
      .catch(() => false);
  }

  const currentServer = computed(() => {
    if (selected.value === -1) {
      return null;
    }

    return servers.value[selected.value];
  });

  return {
    servers,
    currentServer,
    host,
    port,
    isConnected,
    add,
    select,
    tryConnect,
  };
});

export default useServerStore;
