<template>
  <div class="tw-mx-auto tw-container">
    <AppCard title="Settings">
      <template #buttons>
        <q-btn color="primary" icon="fas fa-plus" :label="t('dashboard.notification.add')" @click="showAddDialog = true" />
      </template>

      <div v-if="notificationStore.configuredNotifications.length" class="tw-flex tw-gap-4">
        <div>
          <q-list separator dense bordered>
            <q-item
              v-for="notification in notificationStore.configuredNotifications"
              :key="notification.id"
              :active="activeSetting === notification.id"
              clickable
              @click="activeSetting = notification.id"
            >
              <q-item-section>
                {{ t(`dashboard.notifications.${notification.notificationId}.title`) }}
              </q-item-section>
              <q-item-section side>
                <q-icon
                  name="fas fa-trash"
                  color="red"
                  size="xs"
                  class="cursor-pointer"
                  @click.stop="deleteNotification(notification.id)"
                >
                  <q-tooltip>
                    Delete Notification
                  </q-tooltip>
                </q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-separator vertical />
        <div class="tw-flex-auto tw-flex tw-flex-col tw-gap-4">
          <q-toggle v-model="settings.enabled" label="Enabled" />

          <template v-if="activeNotification">
            <CustomConfigurationField
              v-for="configuration in configurations"
              :key="configuration.id"
              v-model="settings[configuration.id]!"
              :configuration
            />
          </template>

          <div class="q-mx-auto q-mt-lg">
            <q-btn :label="t('global.save')" color="green" @click="save" />
          </div>
        </div>
      </div>
      <AppAlert v-else type="info" text>
        {{ t('dashboard.notification.empty') }}
      </AppAlert>
    </AppCard>

    <CategoryDialogOverview
      v-model="showAddDialog"
      :entries="notificationStore.availableNotifications"
      name-key="notifications"
      type="notification"
      @added="onAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import useNotificationStore from 'stores/notification';
import AppCard from 'components/AppCard.vue';
import { useTranslation } from 'i18next-vue';
import AppAlert from 'components/AppAlert.vue';
import CategoryDialogOverview from 'components/dashboard/CategoryDialogOverview.vue';
import {
  ConfigurationData,
  CustomConfigurationItem,
  openEditConfigurationDialog,
} from 'src/utils/dashboard/configuration';
import CustomConfigurationField from 'components/dashboard/CustomConfigurationField.vue';
import { Dialog, Notify } from 'quasar';

//#region Composable & Prepare
const notificationStore = useNotificationStore();
const { t, } = useTranslation();
//#endregion

//#region Data
const activeSetting = ref('');
const showAddDialog = ref(false);
const settings = ref<ConfigurationData>({});
const configurations = ref<CustomConfigurationItem[]>([]);
//#endregion

//#region Computed
const activeNotification = computed(() => {
  return notificationStore.activeNotifications[activeSetting.value];
});
//#endregion

//#region Watch
watch(activeNotification, () => {
  if (!activeNotification.value) {
    return;
  }

  settings.value = Object.assign({}, activeNotification.value.configuration);
  configurations.value = activeNotification.value.notification.getConfigurations() || [];
}, {
  immediate: true,
});
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
async function onAdded(id: string) {
  const notification = notificationStore.availableNotifications[id];
  if (!notification) {
    return;
  }

  (await openEditConfigurationDialog(notification.getConfigurations())).onOk((configuration: ConfigurationData) => {
    notificationStore.registerNotification(id, configuration);
    selectFirstNotification();
  });
}

function selectFirstNotification() {
  activeSetting.value = Object.keys(notificationStore.activeNotifications)[0] || '';
}

function deleteNotification(id: string) {
  Dialog.create({
    message: t('dashboard.widget.delete_confirm'),
    ok: {
      color: 'primary',
    },
  }).onOk(() => {
    notificationStore.unregisterNotification(id);
    selectFirstNotification();
  });
}

function save() {
  // TODO validate
  Notify.create({
    message: t('global.saved'),
    color: 'green',
    position: 'top-right',
  });

  notificationStore.configuredNotifications.find((notification) => notification.id === activeSetting.value)!.configuration = settings.value;
  activeNotification.value!.configuration = settings.value;
}
//#endregion

//#region Created
selectFirstNotification();
//#endregion
</script>
