import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type FRMNotification from 'src/utils/dashboard/notifications/FRMNotification';
import { ConfigurationData } from 'src/utils/dashboard/configuration';
import ActiveNotification from 'src/utils/dashboard/notification';
import { uuidv4 } from '@derpierre65/frontend-utils';

type NotificationObject = {
  icon: string;
  title: string;
  message: string;
  time: number;
};

const useNotificationStore = defineStore('notification', () => {
  const availableNotifications = ref<Record<string, FRMNotification>>({});
  const notifications = ref<NotificationObject[]>([]);
  const activeNotifications = ref<Record<string, ActiveNotification>>({});
  const configuredNotifications = ref<Array<{
    id: string;
    notificationId: string;
    configuration: ConfigurationData;
    currentState: object;
  }>>([]);

  watch(configuredNotifications, initializeNotifications, {
    deep: 1,
  });

  async function loadAvailableNotifications() {
    const modules = (import.meta.glob('src/utils/dashboard/notifications/*.ts')) as Record<string, () => Promise<{
      default: typeof FRMNotification;
    }>>;

    for (const path of Object.keys(modules)) {
      if (path.endsWith('/FRMNotification.ts')) {
        continue;
      }

      const classObject = (await modules[path]()).default;
      const classInstance = new classObject();
      if (classInstance.id) {
        if (availableNotifications.value[classInstance.id]) {
          console.error(`[Dashboard:Notifications] Notification object with id ${classInstance.id} already exists.`, classObject);
        }

        console.debug(`[Dashboard:Notifications] Loaded notification object ${classInstance.id}.`);
        availableNotifications.value[classInstance.id] = classInstance;
      }
      else {
        console.error('[Dashboard:Notifications] Notification object has no id.', classObject);
      }
    }

    initializeNotifications();
  }

  function initializeNotifications() {
    for (const item of configuredNotifications.value) {
      if (!activeNotifications.value[item.id] && availableNotifications.value[item.notificationId]) {
        activeNotifications.value[item.id] = new ActiveNotification(
          availableNotifications.value[item.notificationId]!,
          item.configuration,
        );

        if (item.configuration.enabled) {
          activeNotifications.value[item.id]!.enable();
        }
      }
    }

    console.log('initializeNotifications', configuredNotifications.value, activeNotifications.value);
  }

  function unregisterNotification(id: string) {
    const idx = configuredNotifications.value.findIndex((item) => item.id === id);
    if (idx === -1) {
      return;
    }

    configuredNotifications.value.splice(idx, 1);
    activeNotifications.value[id]?.disable();
    delete activeNotifications.value[id];
  }

  function registerNotification(id: string, configuration: ConfigurationData) {
    configuredNotifications.value.push({
      id: uuidv4(),
      notificationId: id,
      configuration: {
        ...configuration,
        enabled: true,
      },
      currentState: availableNotifications.value[id]?.state() || {},
    });
  }

  window.setInterval(() => {
    for (const configuredNotification of configuredNotifications.value) {
      if (!configuredNotification.configuration.enabled) {
        continue;
      }

      activeNotifications.value[configuredNotification.id]?.notification.trigger(
        configuredNotification.currentState,
        configuredNotification.configuration,
      );
    }
  }, 2_000);

  return {
    activeNotifications,
    availableNotifications,
    notifications,
    configuredNotifications,
    registerNotification,
    unregisterNotification,
    loadAvailableNotifications,
  };
}, {
  persist: {
    debug: true,
    pick: [
      'notifications',
      'configuredNotifications',
    ],
  },
});

export {
  useNotificationStore as default,
};
