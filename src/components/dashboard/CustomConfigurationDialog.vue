<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="tw-max-w-[300px] tw-w-full">
      <q-card-section>
        <CustomConfigurationField
          v-for="configuration in configurations"
          :key="configuration.id"
          v-model="settings[configuration.id]!"
          :error-message="errors[configuration.id] || ''"
          :configuration
        />
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
import CustomConfigurationField from 'components/dashboard/CustomConfigurationField.vue';
import { CustomConfigurationItem } from 'src/utils/dashboard/configuration';

//#region Composable & Prepare
const { configurations, defaultSettings = null, } = defineProps<{
  configurations: CustomConfigurationItem[];
  defaultSettings?: Record<string, string | number | boolean> | null;
}>();

defineEmits([ ...useDialogPluginComponent.emits, ]);

const { t, } = useTranslation();

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();
//#endregion

//#region Data
const errors = ref<Record<string, string>>({});
const settings = ref<Record<string, string | number | boolean>>(defaultSettings || {});
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
  for (const configuration of configurations || []) {
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
