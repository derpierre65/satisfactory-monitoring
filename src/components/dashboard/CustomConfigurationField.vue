<template>
  <q-select
    v-if="configuration.type === 'select'"
    v-model="currentValue"
    :options="configuration.fromEndpoint ? dataStore.apiData[configuration.fromEndpoint] : configuration.options"
    :label="t(configuration.label)"
    :option-label="configuration.optionLabel"
    :option-value="configuration.optionValue"
    :required="configuration.required"
    :hint="configuration.hint ? t(configuration.hint) : undefined"
    :error="!!errorMessage"
    :error-message="errorMessage"
    emit-value
    map-options
  />
  <div v-else-if="configuration.type === 'boolean'">
    <q-toggle
      v-model="currentValue"
      :label="t(configuration.label)"
    />
  </div>
  <q-input
    v-else-if="configuration.type === 'text'"
    v-model="currentValue"
    :hint="configuration.hint ? t(configuration.hint) : undefined"
    v-bind="configuration.props"
    :label="t(configuration.label)"
  />
</template>

<script setup lang="ts">
import { CustomConfigurationItem } from 'src/utils/dashboard/configuration';
import { useTranslation } from 'i18next-vue';
import useDataStore from 'stores/data';

//#region Composable & Prepare
withDefaults(defineProps<{
  configuration: CustomConfigurationItem;
  errorMessage?: string;
}>(), {
  errorMessage: '',
});

const currentValue = defineModel<string | boolean | number>();

const dataStore = useDataStore();
const { t, } = useTranslation();
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
