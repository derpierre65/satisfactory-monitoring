import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type FRMNotification from 'src/utils/dashboard/notifications/FRMNotification';
import { unique } from '@derpierre65/frontend-utils';

type NotificationObject = {
  icon: string;
  title: string;
  message: string;
  time: number;
};

const useNotificationStore = defineStore('notification', () => {
  const availableNotifications = ref<FRMNotification[]>([]);
  const notifications = ref<NotificationObject[]>([]);
  const settings = ref<Array<Record<string, unknown>>>([]); // TODO replace unknown

  const categories = computed(() => {
    return unique(availableNotifications.value.map((notification) => notification.category));
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
        console.debug(`[Dashboard:Notifications] Loaded notification object ${classInstance.id}.`);
        availableNotifications.value.push(classInstance);
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
    categories,
    loadAvailableNotifications,
  };
});

export {
  useNotificationStore as default,
};
