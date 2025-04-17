<template>
  <q-card class="no-shadow">
    <q-card-section class="flex">
      <slot name="title">
        <span class="text-h6">{{ title }}</span>
      </slot>
      <q-space />
      <slot name="buttons" />
    </q-card-section>
    <q-separator />

    <q-card-section :class="sectionClass">
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
//#region Composable & Prepare
withDefaults(defineProps<{
  title?: string;
  sectionClass?: string | string[] | object | object[];
}>(), {
  title: '',
  sectionClass: '',
});

defineSlots<{
  title: () => void;
  default: () => void;
  buttons: () => void;
}>();

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
