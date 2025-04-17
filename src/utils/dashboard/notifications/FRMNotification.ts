import { Endpoint } from '@derpierre65/ficsit-remote-monitoring';
import useDataStore from 'stores/data';
import { CustomConfigurationItem } from 'src/utils/dashboard/configuration';

export default class FRMNotification {
  id = '';

  category = '';

  requiredEndpoints: Endpoint[] = [];

  configuration: CustomConfigurationItem[] = [];

  private _listen: string[] = [];

  private _isEnabled = false;

  getConfigurations() {
    return [
      {
        id: 'sendToChat',
        label: 'dashboard.notification.configuration.send_to_chat',
        type: 'boolean',
      },
      {
        id: 'sendToChatMessage',
        label: 'dashboard.notification.configuration.send_to_chat_message',
        type: 'text',
        defaultValue: '',
        props: {
          type: 'text',
        },
      },

      ...this.configuration,
    ] as CustomConfigurationItem[];
  }

  enable() {
    this.listenEndpoints();

    this._isEnabled = true;
  }

  disable() {
    const dataStore = useDataStore();
    for (const id of this._listen) {
      dataStore.removeEndpoint(id);
    }

    this._isEnabled = false;
    this._listen = [];
  }

  private listenEndpoints() {
    if (this.requiredEndpoints.length === 0) {
      return;
    }

    const dataStore = useDataStore();
    for (const endpoint of this.requiredEndpoints) {
      this._listen.push(dataStore.addEndpoint(endpoint, 1));
    }
  }
}
