import { boot } from 'quasar/wrappers';
import useServerStore from 'stores/server.ts';
import { Loading } from 'quasar';
import { showCantConnectDialog } from 'src/utils/server.ts';

export default boot(async({ router, route, }) => {
  const serverStore = useServerStore();

  if (serverStore.currentServer === null && route.name !== 'login') {
    return router.push({
      name: 'login',
    });
  }

  Loading.show({
    group: 'tryConnect',
    message: 'Connecting...',
  });

  const isConnected = await serverStore.tryConnect(serverStore.currentServer);

  Loading.hide('tryConnect');

  if (!isConnected) {
    showCantConnectDialog(serverStore.currentServer);

    return router.push({
      name: 'login',
    });
  }

  serverStore.isConnected = true;
});
