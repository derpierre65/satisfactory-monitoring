import { boot } from 'quasar/wrappers';
import useServerStore from 'stores/server.ts';
import { Dialog, Loading } from 'quasar';

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
    Dialog.create({
      message: 'Fail to connect.',
    });

    return router.push({
      name: 'login',
    });
  }

  serverStore.isConnected = true;
});
