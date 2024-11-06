<template>
  <q-dialog>
    <q-card class="full-width" style="max-width: 800px;">
      <q-card-section class="text-h6 tw-flex justify-between">
        <span>{{ t('dashboard.widget_add') }}</span>
        <q-icon name="fas fa-times" class="cursor-pointer" @click="$emit('update:modelValue', false)" />
      </q-card-section>
      <q-separator />
      <div class="flex no-wrap items-start">
        <div class="tw-min-w-[30%]">
          <div class="q-ml-xs q-mr-md q-my-md">
            <q-input v-model="search" :label="t('global.search')">
              <template #prepend />
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
                <span>{{ t(`dashboard.widget_categories.${category}`) }}</span>
                <q-badge>{{ availableWidgets[category] ? availableWidgets[category].length : 0 }}</q-badge>
              </div>
            </q-tab>
          </q-tabs>
        </div>
        <q-separator vertical size="2px" class="!-tw-ml-0.5" />

        <div class="tw-flex-auto q-px-md q-gutter-xs q-pa-md">
          <AppAlert v-if="!availableWidgets[selectedCategory]" type="info">
            {{ t('dashboard.widget_category_empty') }}
          </AppAlert>
          <q-btn
            v-for="widgetId in availableWidgets[selectedCategory]"
            :key="widgetId"
            :label="t(`dashboard.widgets.${widgetId}.title`)"
            color="primary"
            @click="addWidget(widgets[widgetId])"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { openEditWidget, Widget, WidgetConfigurationData, widgets } from 'src/utils/dashboard/widgets.ts';
import { useTranslation } from 'i18next-vue';
import AppAlert from 'components/AppAlert.vue';

//#region Composable & Prepare
const emit = defineEmits<{
  added: [widget: string, configurations: WidgetConfigurationData];
}>();

const { t, } = useTranslation();
//#endregion

//#region Data
const categories = [
  'power',
  'sink',
  'session',
  'inventory',
];
const selectedCategory = ref('');
const search = ref('');
//#endregion

//#region Computed
const filteredWidgets = computed(() => {
  const searchTerm = search.value.toLowerCase();

  return Object.keys(widgets).filter((id) => t(`dashboard.widgets.${id}.title`).toLowerCase().includes(searchTerm));
});
const availableWidgets = computed(() => {
  return Object.groupBy(filteredWidgets.value, (id) => widgets[id].category);
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
async function addWidget(widget: Widget) {
  (await openEditWidget(widget)).onOk((configurations: WidgetConfigurationData) => {
    emit('added', widget.id, configurations);
  });
}
//#endregion

//#region Created
selectedCategory.value = categories[0];
//#endregion
</script>
