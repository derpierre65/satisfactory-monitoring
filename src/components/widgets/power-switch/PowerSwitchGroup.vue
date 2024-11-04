<template>
  <q-card class="no-shadow tw-min-h-64 tw-flex tw-flex-col">
    <div class="tw-bg-neutral-800 tw-flex tw-items-center q-pa-sm">
      <div>{{ title }}</div>
      <q-space />
      <div class="tw-flex">
        <q-btn label="ON" dense @click="switchAll(switches, true)" />
        <q-btn label="OFF" dense @click="switchAll(switches, false)" />
      </div>
    </div>
    <component
      :is="groupId === -1 ? 'div' : VueDraggable"
      v-bind="componentProps"
      class="tw-flex-auto q-pa-md"
    >
      <PowerSwitchSwitcher
        v-for="powerSwitch in switches"
        :key="powerSwitch.ID"
        :item="powerSwitch"
      />
    </component>
  </q-card>
</template>

<script setup lang="ts">
import PowerSwitchSwitcher from 'components/widgets/power-switch/PowerSwitchSwitcher.vue';
import { DraggableEvent, VueDraggable } from 'vue-draggable-plus';
import { computed } from 'vue';
import useServerStore from 'stores/server.ts';
import useDataStore from 'stores/data.ts';
import { switchAll, updateSwitchPriority } from 'src/utils/api/switches.ts';

//#region Composable & Prepare
const { groupId = -1, switches, } = defineProps<{
  groupId?: number;
  title: string;
  switches: [];
}>();

const serverStore = useServerStore();
const dataStore = useDataStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const componentProps = computed(() => {
  if (groupId >= 0) {
    return {
      'data-group-id': groupId,
      modelValue: switches,
      group: 'power-switch',
      sort: false,
      onEnd: updatePriority,
    };
  }

  return {};
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function updatePriority(event: DraggableEvent) {
  if (typeof event.oldIndex !== 'number') {
    return;
  }

  const powerSwitch = switches[event.oldIndex];
  if (!powerSwitch || !event.to.dataset.groupId) {
    return;
  }

  updateSwitchPriority(powerSwitch, parseInt(event.to.dataset.groupId!));
}

//#endregion

//#region Created
//#endregion
</script>
