import { Endpoint } from '@derpierre65/ficsit-remote-monitoring';
import useDataStore from 'stores/data';

export default class FRMNotification {
  id = '';

  category = '';

  requiredEndpoints: Endpoint[] = [];

  private _listen: string[] = [];

  private _isEnabled = false;

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
