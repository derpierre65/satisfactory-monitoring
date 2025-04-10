<template>
  <q-tabs no-caps stretch align="justify">
    <q-route-tab :to="{name: 'vehicle-cars'}" :label="t('vehicles.cars.title')" />
    <q-route-tab :to="{name: 'vehicle-trains'}" :label="t('vehicles.trains.title')" />
    <q-route-tab :to="{name: 'vehicle-drones'}" :label="t('vehicles.drones.title')" />
  </q-tabs>
  <q-separator />

  <div class="q-pa-md tw-flex-auto tw-flex tw-flex-col">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

const { t, } = useTranslation();
</script>
