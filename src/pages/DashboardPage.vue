<template>
  <q-page>
    <div class="tw-flex tw-justify-end">
      <q-btn color="primary" icon="fas fa-plus" label="Add Widget" @click="showAddWidget = true" />
    </div>

    <GridLayout
      v-model:layout="layout"
      :col-num="20"
      :row-height="30"
      is-draggable
      is-resizable
      use-css-transforms
      @noc-layout-update="saveLayout"
    >
      <template #default="{ gridItemProps }">
        <GridItem
          v-for="item in layout"
          :key="item.id"
          v-bind="{...gridItemProps, ...item}"
          drag-allow-from=".title-bar"
        >
          <q-card class="tw-flex tw-flex-col tw-h-full no-shadow">
            <q-card-section class="tw-bg-neutral-950 tw-flex tw-items-center tw-justify-between q-py-xs title-bar">
              <span>{{ widgets[dashboardWidgets[item.id].widgetId].title }}</span>
              <q-icon name="fas fa-ellipsis-v" />
            </q-card-section>

            <q-card-section class="tw-flex-auto q-py-sm relative-position">
              <span
                v-if="invalidWidgets.includes(item.id)"
                class="tw-text-red-500"
              >This widget is invalid, check the configuration or delete this widget.</span>
              <component
                :is="widgets[dashboardWidgets[item.id].widgetId].component"
                v-else-if="dashboardWidgets[item.id].props !== null"
                v-bind="dashboardWidgets[item.id].props"
              />
              <q-inner-loading v-else showing />
            </q-card-section>
          </q-card>
        </GridItem>
      </template>
    </GridLayout>
  </q-page>

  <DashboardWidgetDialogOverview v-model="showAddWidget" @added="addNewWidget" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GridLayout, GridItem } from '@noction/vue-draggable-grid';
import DashboardWidgetDialogOverview from 'components/dashboard/DashboardWidgetDialogOverview.vue';
import '@noction/vue-draggable-grid/styles';
import { GridLayoutEntry, Widget, widgets } from 'src/utils/dashboard/widgets.ts';
import { useInterval, uuidv4 } from '@derpierre65/frontend-utils';
import useSettingsStore from 'stores/settings.ts';
import useDataStore from 'stores/data.ts';

//#region Composable & Prepare
defineOptions({
  name: 'DashboardPage',
});

const { setInterval, } = useInterval();
const settingsStore = useSettingsStore();
const dataStore = useDataStore();
//#endregion

//#region Data
const loaded = ref(false);
const showAddWidget = ref(false);
const invalidWidgets = ref<string[]>([]);
const layout = ref<GridLayoutEntry[]>([]);
const dashboardWidgets = ref<Record<string, {
  widgetId: string;
  configuration: Record<string, unknown>;
}>>({});
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function validateWidgets() {
  const invalidIds = [];

  for (const widgetId of Object.keys(dashboardWidgets.value)) {
    const dashboardWidget = dashboardWidgets.value[widgetId];
    const widget = widgets[dashboardWidget.widgetId];
    if (!widget) {
      invalidIds.push(widgetId);
      continue;
    }

    if (typeof widget.isValid === 'undefined') {
      continue;
    }

    const valid = widget.isValid(dashboardWidget.configuration);
    if (valid === false) {
      invalidIds.push(widgetId);
    }
  }

  invalidWidgets.value = invalidIds;
}

function saveLayout() {
  if (!loaded.value) {
    return;
  }

  settingsStore.dashboardLayout = layout.value.filter((item) => dashboardWidgets.value[item.id]).map((item) => ({
    grid: {
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    },
    widget: dashboardWidgets.value[item.id],
  }));
}

function loadLayout() {
  for (const data of settingsStore.dashboardLayout) {
    if (!data.widget) {
      continue;
    }
    addNewWidget(
      widgets[data.widget.widgetId],
      data.widget.configuration,
      data.grid,
    );
  }

  validateWidgets();

  loaded.value = true;
}

function buildWidgetLayout(widget: Widget) {
  const widgetLayoutInfo = widget.layoutInfo;

  return {
    x: 1,
    y: 1,
    w: widgetLayoutInfo.minW || 2,
    h: widgetLayoutInfo.minH || 4,
    minW: 1,
    minH: 2,
    ...widgetLayoutInfo,
  };
}

function addNewWidget(widget: Widget, configuration: Record<string, unknown>, gridOptions = {}) {
  const id = uuidv4();
  layout.value.push({
    id,
    ...buildWidgetLayout(widget),
    ...gridOptions,
  });

  if (widget.endpoints) {
    for (const endpoint of widget.endpoints) {
      dataStore.addEndpoint(endpoint);
    }
  }

  dashboardWidgets.value[id] = {
    widgetId: widget.id,
    props: widget.props ? widget.props(configuration) : false,
    configuration,
  };
}
//#endregion

//#region Created
loadLayout();

setInterval(() => {
  validateWidgets();
}, 2_000, 'validateWidgets');
//#endregion
</script>
