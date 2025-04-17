<template>
  <q-tabs no-caps stretch align="justify">
    <q-route-tab :to="{name: 'notifications'}" label="Notifications" />
    <q-route-tab :to="{name: 'notification-settings'}" label="Settings" />
  </q-tabs>
  <q-separator />

  <div class="q-pa-md">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
