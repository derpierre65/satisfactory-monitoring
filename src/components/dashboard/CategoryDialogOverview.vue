<template>
  <q-dialog>
    <q-card class="full-width" style="max-width: 800px;">
      <q-card-section class="text-h6 tw-flex justify-between items-center">
        <span>{{ t(`dashboard.${type}.add`) }}</span>
        <q-icon name="fas fa-times" class="cursor-pointer" @click="dialog?.hide()" />
      </q-card-section>
      <q-separator />
      <div class="flex no-wrap items-start">
        <div class="tw-min-w-[30%]">
          <div class="q-ml-xs q-mr-md q-my-md">
            <q-input v-model="search" :label="t('global.search')">
              <template #prepend>
                <i class="fas fa-search tw-text-sm" />
              </template>
            </q-input>
          </div>

          <q-tabs v-model="selectedCategory" vertical no-caps>
            <q-tab
              v-for="category of categories"
              :key="category"
              :name="category"
              content-class="tw-w-full !tw-items-start q-pr-md"
            >
              <div class="full-width tw-flex tw-gap-4 tw-justify-between">
                <span>{{ category === 'none' ? t('dashboard.category.none') : t(`dashboard.${type}.categories.${category}`) }}</span>
                <q-badge>{{ available[category] ? available[category].length : 0 }}</q-badge>
              </div>
            </q-tab>
          </q-tabs>
        </div>
        <q-separator vertical size="2px" class="!-tw-ml-0.5" />

        <div class="tw-flex-auto q-px-md q-gutter-xs q-pa-md">
          <AppAlert v-if="!available[selectedCategory]" type="info">
            {{ t('dashboard.category.category_empty') }}
          </AppAlert>
          <q-btn
            v-for="id in available[selectedCategory]"
            :key="id"
            :label="t(`dashboard.${nameKey}.${id}.title`)"
            color="primary"
            @click="$emit('added', id)"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useTranslation } from 'i18next-vue';
import AppAlert from 'components/AppAlert.vue';
import type { QDialog } from 'quasar';

//#region Composable & Prepare
const props = defineProps<{
  type: string;
  nameKey: string;
  entries: Record<string, {
    category: string;
  }>;
}>();

defineEmits<{
  added: [id: string];
}>();

const { t, } = useTranslation();
const dialog = useTemplateRef<InstanceType<typeof QDialog>>('dialog');
//#endregion

//#region Data
const categories = ref<string[]>([]);
const selectedCategory = ref('');
const search = ref('');
//#endregion

//#region Computed
const filtered = computed(() => {
  const searchTerm = search.value.toLowerCase();

  return Object.keys(props.entries).filter((id) => t(`dashboard.${props.nameKey}.${id}.title`).toLowerCase().includes(searchTerm));
});
const available = computed(() => {
  return Object.groupBy(filtered.value, (id) => props.entries[id]?.category || 'none');
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
categories.value = Object.keys(available.value);
if (categories.value[0]) {
  selectedCategory.value = categories.value[0];
}
//#endregion
</script>
