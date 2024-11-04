<template>
  <q-dialog>
    <q-card class="full-width" style="max-width: 800px;">
      <q-card-section class="text-h6">
        Add Widget
      </q-card-section>
      <q-separator />
      <q-card-section class="flex no-wrap items-start">
        <q-tabs
          v-if="categories.length > 1"
          v-model="selectedCategory"
          vertical
          no-caps
        >
          <q-tab
            v-for="category of categories"
            :key="category.value"
            :name="category.value"
            content-class="tw-w-full !tw-items-start q-pr-md"
          >
            <div>{{ category.label }}</div>
          </q-tab>
        </q-tabs>
        <q-separator vertical size="2px" class="!-tw-ml-0.5" />

        <div class="tw-flex-auto q-px-md q-gutter-xs">
          <q-btn
            v-for="widget in availableWidgets"
            :key="widget.id"
            :label="widget.title"
            color="primary"
            @click="addWidget(widget)"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { openEditWidget, Widget, widgets } from 'src/utils/dashboard/widgets.ts';

//#region Composable & Prepare
const emit = defineEmits<{
  added: [widget: Widget, configurations: Record<string, unknown>];
}>();
//#endregion

//#region Data
const categories = ref([
  {
    label: 'Power',
    value: 'power',
  },
  {
    label: 'Inventories',
    value: 'inventories',
  },
  {
    label: 'AWESOME Sink',
    value: 'sink',
  },
  {
    label: 'Other',
    value: 'other',
  },
]);
const selectedCategory = ref(categories.value[0].value);

//#endregion

//#region Computed
const availableWidgets = computed(() => {
  return Object.keys(widgets).filter((widget) => widgets[widget].category === selectedCategory.value).map((id) => {
    return widgets[id];
  });
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
async function addWidget(widget: Widget) {
  (await openEditWidget(widget)).onOk((configurations) => {
    emit('added', widget, configurations);
  });
}
//#endregion

//#region Created
//#endregion
</script>
