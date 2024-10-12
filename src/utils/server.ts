import { Dialog } from 'quasar';
import { ServerInfo } from 'stores/server.ts';

function showCantConnectDialog(server: ServerInfo) {
  Dialog.create({
    message: `Can't connect to ${server.host}:${server.port}`,
    class: 'shadow-0',
  });
}

export {
  showCantConnectDialog,
};
