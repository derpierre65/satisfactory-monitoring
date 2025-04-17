import { defineStore } from 'pinia';
import { ref } from 'vue';
import type FRMNotification from 'src/utils/dashboard/notifications/FRMNotification';

type NotificationObject = {
  icon: string;
  title: string;
  message: string;
  time: number;
};

const useNotificationStore = defineStore('notification', () => {
  const availableNotifications = ref<Record<string, FRMNotification>>({});
  const notifications = ref<NotificationObject[]>([]);
  const settings = ref<Array<Record<string, Record<string, number | boolean | string>>>>([]);

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
  }

  return {
    availableNotifications,
    settings,
    notifications,
    loadAvailableNotifications,
  };
});

export {
  useNotificationStore as default,
};
