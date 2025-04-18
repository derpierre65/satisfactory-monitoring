import FRMNotification from 'src/utils/dashboard/notifications/FRMNotification';
import { Endpoint, GetDoggoResponse } from '@derpierre65/ficsit-remote-monitoring';
import type { ConfigurationData, CustomConfigurationItem } from 'src/utils/dashboard/configuration';
import useDataStore from 'stores/data';
import useServerStore from 'stores/server';

export default class DoggoNotification extends FRMNotification {
  override id = 'doggo';

  override requiredEndpoints: Endpoint[] = [ Endpoint.GetDoggo, ];

  override configuration: CustomConfigurationItem[] = [
    {
      id: 'createPing',
      label: 'dashboard.notifications.doggo.create_ping',
      type: 'boolean',
    },
    {
      id: 'repeatNotificationAfter',
      label: 'dashboard.notifications.doggo.repeat_time',
      hint: 'dashboard.notifications.doggo.repeat_time_hint',
      type: 'text',
      defaultValue: 0,
      props: {
        type: 'number',
        min: 0,
      },
    },

    {
      id: 'message',
      label: 'dashboard.notifications.doggo.found_chat_message',
      type: 'text',
      defaultValue: '',
      props: {
        type: 'text',
      },
    },

    {
      id: 'foundChatMessage',
      label: 'dashboard.notification.configuration.send_chat_message',
      type: 'boolean',
    },
    {
      id: 'foundNotification',
      label: 'dashboard.notification.configuration.send_notification',
      type: 'boolean',
    },

    {
      id: 'collectedChatMessage',
      label: 'dashboard.notifications.doggo.collected_chat_message',
      hint: 'dashboard.notification.configuration.chat_message_hint',
      type: 'text',
      defaultValue: '',
      props: {
        type: 'text',
      },
    },

    {
      id: 'collectedNotificationMessage',
      label: 'dashboard.notifications.doggo.collected_notification_message',
      hint: 'dashboard.notification.configuration.notification_message_hint',
      type: 'text',
      defaultValue: '',
      props: {
        type: 'text',
      },
    },
  ];

  override state() {
    return {
      lastFound: {},
    };
  }

  override trigger(state: Record<string, any>, configuration: ConfigurationData) {
    const doggos = (useDataStore().apiData.getDoggo || []) as GetDoggoResponse;
    if (doggos.length === 0) {
      return;
    }

    const before = Object.keys(state.lastFound).length;
    for (const doggo of doggos) {
      if (!doggo.Inventory[0]) {
        delete state.lastFound[doggo.ID];
        continue;
      }

      const repeatAfter = (configuration.repeatNotificationAfter as number) * 1000;
      if (!state.lastFound[doggo.ID] || (repeatAfter > 0 && Date.now() - state.lastFound[doggo.ID].time > repeatAfter)) {
        state.lastFound[doggo.ID] = {
          found: doggo.Inventory[0].ClassName,
          time: Date.now(),
        };

        const data = {
          name: doggo.Name,
          amount: doggo.Inventory[0].Amount,
          itemName: doggo.Inventory[0].Name,
        };

        if (configuration.foundChatMessage && configuration.message) {
          this.sendChatMessage(configuration.message as string, data);
        }
        if (configuration.foundNotification) {
          this.createNotification('Desc_SpaceRabbit_C', this.formatString(configuration.message as string, data));
        }
        if (configuration.createPing) {
          useServerStore().post('createPing', doggo.location);
        }
      }
    }

    if (before && Object.keys(state.lastFound).length === 0) {
      if (configuration.collectedNotificationMessage) {
        this.createNotification('Desc_SpaceRabbit_C', configuration.collectedNotificationMessage as string);
      }
      if (configuration.collectedChatMessage) {
        this.sendChatMessage(configuration.collectedChatMessage as string);
      }
    }
  }
}
