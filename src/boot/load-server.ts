import { boot } from 'quasar/wrappers';
import useServerStore from 'stores/server.ts';
import { Loading } from 'quasar';

export default boot(async({ router, }) => {
  const serverStore = useServerStore();

  if (serverStore.currentServer === null && router.currentRoute.value.name !== 'login') {
    return router.push({
      name: 'login',
    }).then(() => void 0);
  }

  Loading.show({
    group: 'tryConnect',
    message: 'Connecting...',
  });

  const isConnected = await serverStore.tryConnect(serverStore.currentServer!);

  Loading.hide('tryConnect');

  if (!isConnected) {
    return router.push({
      name: 'login',
    }).then(() => void 0);
  }

  serverStore.isConnected = true;
});
