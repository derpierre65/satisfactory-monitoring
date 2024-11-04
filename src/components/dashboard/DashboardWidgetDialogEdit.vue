<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="tw-max-w-[300px] tw-w-full">
      <q-card-section>
        <template v-for="configuration in widget.configuration" :key="configuration.id">
          <q-select
            v-if="configuration.type === 'select'"
            v-model="settings[configuration.id]"
            :options="configuration.fromEndpoint ? endpointData[configuration.fromEndpoint] : configuration.options"
            :label="configuration.label"
            :option-label="configuration.optionLabel"
            :option-value="configuration.optionValue"
            :required="configuration.required"
            :error="!!errors[configuration.id]"
            :error-message="errors[configuration.id]"
            emit-value
            map-options
          />
        </template>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="save" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Widget } from 'src/utils/dashboard/widgets.ts';
import { ref } from 'vue';

//#region Composable & Prepare
const { widget, defaultSettings = null, } = defineProps<{
  endpointData: Record<string, unknown>;
  widget: Widget;
  defaultSettings?: Record<string, unknown> | null;
}>();

defineEmits([ ...useDialogPluginComponent.emits, ]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();
//#endregion

//#region Data
const errors = ref<Record<string, string>>({});
const settings = ref(defaultSettings || {});
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function save() {
  errors.value = {};
  for (const configuration of widget.configuration) {
    if (configuration.required && !settings.value[configuration.id]) {
      errors.value[configuration.id] = 'This field is required.';
    }
  }

  onDialogOK(settings.value);
}
//#endregion

//#region Created
//#endregion
</script>
