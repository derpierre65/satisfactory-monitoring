<template>
  <q-list v-if="notificationStore.notifications.length" bordered separator>
    <q-item v-for="(notification, index) in notificationStore.notifications" :key="index + notification.time + notification.message">
      <q-item-section side>
        <q-icon v-if="notification.icon.includes(' ')" :name="notification.icon" />
        <img v-else :src="serverStore.getItemUrl(notification.icon)" class="tw-max-w-[32px]">
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="false" overline>
          {{ notification.title }}
        </q-item-label>
        <q-item-label>{{ notification.message }}</q-item-label>
        <q-item-label caption>
          {{ date.formatDate(notification.time, 'YYYY-MM-DD HH:mm:ss') }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon name="fas fa-check" size="16px" class="cursor-pointer" @click="notificationStore.notifications.splice(index, 1)">
          <q-tooltip>
            Mark as Read
          </q-tooltip>
        </q-icon>
      </q-item-section>
    </q-item>
  </q-list>
  <AppAlert v-else type="success">
    No notifications available.
  </AppAlert>
</template>

<script setup lang="ts">
import useNotificationStore from 'stores/notification';
import useServerStore from 'stores/server';
import { date } from 'quasar';
import AppAlert from 'components/AppAlert.vue';

//#region Composable & Prepare
const serverStore = useServerStore();
const notificationStore = useNotificationStore();
//#endregion

//#region Data
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>
