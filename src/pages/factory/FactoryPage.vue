<template>
  <q-tabs no-caps stretch align="justify">
    <q-route-tab :to="{name: 'factory-efficiency'}" label="Factory Efficiency" />
  </q-tabs>

  <div class="q-pa-md tw-flex-auto tw-flex tw-flex-col">
    <router-view />
  </div>
</template>
