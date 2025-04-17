import FRMNotification from 'src/utils/dashboard/notifications/FRMNotification';
import useDataStore from 'stores/data';
import { ConfigurationData } from 'src/utils/dashboard/configuration';

export default class ActiveNotification {
  enabled = false;

  private _listenEndpoints: string[] = [];

  private state = {};

  constructor(public notification: FRMNotification, public configuration: ConfigurationData = {}) {}

  enable() {
    this.listenEndpoints();
    this.enabled = true;
  }

  disable() {
    const dataStore = useDataStore();
    for (const id of this._listenEndpoints) {
      dataStore.removeEndpoint(id);
    }

    this._listenEndpoints = [];
    this.enabled = false;
  }

  private listenEndpoints() {
    if (this.notification.requiredEndpoints.length === 0 || this.enabled) {
      return;
    }

    const dataStore = useDataStore();
    for (const endpoint of this.notification.requiredEndpoints) {
      this._listenEndpoints.push(dataStore.addEndpoint(endpoint, 1_000));
    }
  }
}
