<template>
  <q-tabs no-caps stretch align="justify">
    <q-route-tab :to="{name: 'inventory'}" label="Inventories" />
    <q-route-tab :to="{name: 'inventory-items'}" label="Items" />
  </q-tabs>

  <div class="q-pa-md">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
