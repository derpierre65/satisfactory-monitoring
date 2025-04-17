import { boot } from 'quasar/wrappers';
import useNotificationStore from 'stores/notification';

export default boot(async() => {
  await useNotificationStore().loadAvailableNotifications();
});
