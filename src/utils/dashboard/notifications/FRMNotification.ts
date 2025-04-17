import { Endpoint } from '@derpierre65/ficsit-remote-monitoring';
import type { ConfigurationData, CustomConfigurationItem } from 'src/utils/dashboard/configuration';
import useNotificationStore from 'stores/notification';
import useServerStore from 'stores/server';

export default class FRMNotification {
  id = '';

  category = '';

  requiredEndpoints: Endpoint[] = [];

  configuration: CustomConfigurationItem[] = [];

  state() {
    return {};
  }

  getConfigurations() {
    return this.configuration as CustomConfigurationItem[];
  }

  formatString(template: string, values: Record<string, string | number>) {
    return template.replace(/{(.*?)}/g, (_, key) => values[key]?.toString() || `{${key}}`);
  }

  sendChatMessage(message: string, data: object = {}) {
    useServerStore().post('sendChatMessage', {
      message: this.formatString(message, data),
    });
  }

  createNotification(icon: string, message: string) {
    // TODO send dashboard notification (Notify.create)
    const notificationStore = useNotificationStore();
    notificationStore.notifications.unshift({
      time: Date.now(),
      title: '',
      message,
      icon,
    });
    if (notificationStore.notifications.length > 100) {
      notificationStore.notifications.splice(100);
    }
  }

  trigger(state: object, configuration: ConfigurationData) {
    // do something here.
  }
}
