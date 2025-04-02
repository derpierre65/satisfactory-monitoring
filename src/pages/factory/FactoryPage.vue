<template>
  <q-tabs no-caps stretch align="justify">
    <q-route-tab :to="{name: 'factory-efficiency'}" label="Factory Efficiency" />
  </q-tabs>

  <div class="q-pa-md">
    <router-view />
  </div>
</template>
