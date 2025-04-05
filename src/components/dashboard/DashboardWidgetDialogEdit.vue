<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="tw-max-w-[300px] tw-w-full">
      <q-card-section>
        <template v-for="configuration in widget.configuration" :key="configuration.id">
          <q-select
            v-if="configuration.type === 'select'"
            v-model="settings[configuration.id]"
            :options="configuration.fromEndpoint ? dataStore.apiData[configuration.fromEndpoint] : configuration.options"
            :label="t(configuration.label)"
            :option-label="configuration.optionLabel"
            :option-value="configuration.optionValue"
            :required="configuration.required"
            :error="!!errors[configuration.id]"
            :error-message="errors[configuration.id]"
            emit-value
            map-options
          />
          <q-toggle
            v-else-if="configuration.type === 'boolean'"
            v-model="settings[configuration.id]"
            :label="t(configuration.label)"
          />
        </template>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" :label="t('global.cancel')" @click="onDialogCancel" />
        <q-space />
        <q-btn color="primary" :label="t('global.ok')" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { Widget } from 'src/utils/dashboard/widgets';
import useDataStore from 'stores/data';

//#region Composable & Prepare
const { widget, defaultSettings = null, } = defineProps<{
  widget: Widget;
  defaultSettings?: Record<string, unknown> | null;
}>();

defineEmits([ ...useDialogPluginComponent.emits, ]);

const { t, } = useTranslation();
const dataStore = useDataStore();

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
  let hasErrors = false;
  errors.value = {};
  for (const configuration of widget.configuration || []) {
    if (configuration.required && !settings.value[configuration.id]) {
      errors.value[configuration.id] = 'This field is required.';
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    onDialogOK(settings.value);
  }
}
//#endregion

//#region Created
//#endregion
</script>
