<template>
  <q-page>
    <div class="tw-flex tw-justify-end tw-gap-2">
      <q-toggle v-model="settingsStore.dashboardHideToolbars" label="Hide Toolbars" />
      <q-btn
        :label="t('dashboard.widget.add')"
        color="primary"
        icon="fas fa-plus"
        @click="showAddWidget = true"
      />
    </div>

    <GridLayout
      v-model:layout="layout"
      :col-num="40"
      :row-height="10"
      is-draggable
      is-resizable
      @noc-layout-update="saveLayout"
    >
      <template #default="{ gridItemProps }">
        <GridItem
          v-for="item in layout"
          :key="item.id"
          v-bind="{...gridItemProps, ...item}"
          drag-allow-from=".title-bar"
          drag-ignore-from=".q-icon"
        >
          <q-card v-if="widgets[dashboardWidgets[item.id].widgetId]" class="tw-flex tw-flex-col full-height no-shadow">
            <q-card-section
              v-if="!settingsStore.dashboardHideToolbars"
              class="tw-bg-neutral-950 tw-flex tw-items-center tw-justify-between q-py-xs title-bar"
            >
              <span>{{ t(`dashboard.widgets.${dashboardWidgets[item.id].widgetId}.title`) }}</span>
              <div v-if="isDevMode" class="tw-text-neutral-600">
                {{ item.w }} x {{ item.h }}
              </div>
              <q-icon name="fas fa-ellipsis-v" class="cursor-pointer">
                <q-menu class="no-shadow">
                  <q-list dense>
                    <q-item
                      v-if="widgets[dashboardWidgets[item.id].widgetId].configuration"
                      v-close-popup
                      clickable
                      @click="editWidget(item.id)"
                    >
                      <q-item-section>
                        <q-item-label>{{ t('global.edit') }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-close-popup clickable @click="deleteWidget(item.id)">
                      <q-item-section>
                        <q-item-label>{{ t('global.delete') }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-card-section>

            <q-card-section class="tw-flex-auto q-py-sm relative-position tw-flex tw-flex-col justify-center">
              <div v-if="invalidWidgets.includes(item.id)" class="flex flex-center full-height tw-text-red-500">
                <small>{{ t('dashboard.widget.invalid') }}</small>
              </div>
              <component
                :is="widgets[dashboardWidgets[item.id]!.widgetId]!.component"
                v-else-if="dashboardWidgets[item.id]!.props !== null"
                v-bind="dashboardWidgets[item.id]!.props"
              />
              <q-inner-loading v-else showing />
            </q-card-section>
          </q-card>
          <q-card v-else class="full-height no-shadow text-center flex flex-center q-pa-md tw-text-red-500">
            <small>{{ t('dashboard.widget.not_found') }}</small>
          </q-card>
        </GridItem>
      </template>
    </GridLayout>
  </q-page>

  <CategoryDialogOverview
    v-model="showAddWidget"
    :entries="widgets"
    type="widget"
    name-key="widgets"
    @added="addOpenDialog"
  />
</template>

<script setup lang="ts">
import { ComputedRef, onUnmounted, ref } from 'vue';
import { GridLayout, GridItem } from '@noction/vue-draggable-grid';
import CategoryDialogOverview from 'components/dashboard/CategoryDialogOverview.vue';
import '@noction/vue-draggable-grid/styles';
import { GridLayoutEntry, Widget, widgets } from 'src/utils/dashboard/widgets';
import { deepClone, useInterval, uuidv4 } from '@derpierre65/frontend-utils';
import useSettingsStore from 'stores/settings';
import useDataStore from 'stores/data';
import { useTranslation } from 'i18next-vue';
import { Dialog } from 'quasar';
import { ConfigurationData, openEditConfigurationDialog } from 'src/utils/dashboard/configuration';

//#region Composable & Prepare
defineOptions({
  name: 'DashboardPage',
});

const { setInterval, } = useInterval();
const settingsStore = useSettingsStore();
const dataStore = useDataStore();
const { t, } = useTranslation();
//#endregion

//#region Data
const isDevMode = import.meta.env.DEV;
const loaded = ref(false);
const showAddWidget = ref(false);
const invalidWidgets = ref<string[]>([]);
const layout = ref<GridLayoutEntry[]>([]);
const dashboardWidgets = ref<Record<string, {
  widgetId: string;
  configuration: ConfigurationData;
  props: ComputedRef<Record<string, unknown> | null> | false;
  listenEndpoints: string[];
}>>({});
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
onUnmounted(() => {
  for (const widgetId of Object.keys(dashboardWidgets.value)) {
    unloadWidget(widgetId);
  }
});
//#endregion

//#region Methods
function validateWidgets() {
  const invalidIds = [];

  for (const widgetId of Object.keys(dashboardWidgets.value)) {
    const dashboardWidget = dashboardWidgets.value[widgetId];
    if (!dashboardWidget) {
      continue;
    }

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
      data.widget.widgetId,
      data.widget.configuration,
      data.grid,
    );
  }

  validateWidgets();

  loaded.value = true;
}

function buildWidgetLayout(widget: Widget | null) {
  const widgetLayoutInfo = (widget && widget.layoutInfo) || {};

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

function unloadWidget(widgetId: string) {
  if (!dashboardWidgets.value[widgetId]) {
    return;
  }

  for (const endpoint of dashboardWidgets.value[widgetId].listenEndpoints || []) {
    dataStore.removeEndpoint(endpoint);
  }
}

async function addOpenDialog(id: string) {
  (await openEditConfigurationDialog(widgets[id]!.configuration)).onOk((configurations: ConfigurationData) => {
    addNewWidget(id, configurations);
  });
}

function addNewWidget(widgetId: string, configuration: ConfigurationData, gridOptions = {}) {
  const widget = widgets[widgetId] || null;

  const id = uuidv4();
  layout.value.push({
    id,
    ...buildWidgetLayout(widget),
    ...gridOptions,
  });

  const listenEndpoints: string[] = [];
  if (widget && widget.endpoints) {
    for (const endpoint of widget.endpoints) {
      listenEndpoints.push(dataStore.addEndpoint(endpoint));
    }
  }

  dashboardWidgets.value[id] = {
    widgetId,
    props: getWidgetProps(widget, configuration),
    configuration,
    listenEndpoints,
  };
}

function getWidgetProps(widget: Widget, configuration: ConfigurationData) {
  if (!widget || !widget.props) {
    return false;
  }

  if (typeof widget.props === 'function') {
    return widget.props(configuration);
  }

  return widget.props;
}

async function editWidget(widgetId: string) {
  const dashboardWidget = dashboardWidgets.value[widgetId];
  if (!dashboardWidget) {
    return;
  }

  (await openEditConfigurationDialog(widgets[dashboardWidget.widgetId]?.configuration, deepClone(dashboardWidget.configuration)))
    .onOk((newConfiguration: ConfigurationData) => {
      const widget = widgets[dashboardWidget.widgetId]!;

      dashboardWidget.props = getWidgetProps(widget, newConfiguration);
      dashboardWidget.configuration = newConfiguration;
    });
}

function deleteWidget(widgetId: string) {
  Dialog.create({
    message: t('dashboard.widget.delete_confirm'),
    ok: {
      color: 'primary',
    },
  }).onOk(() => {
    const index = layout.value.findIndex((item) => item.id === widgetId);
    if (index >= 0) {
      layout.value.splice(index, 1);
    }

    unloadWidget(widgetId);

    delete dashboardWidgets.value[widgetId];
  });
}
//#endregion

//#region Created
loadLayout();

setInterval(() => {
  validateWidgets();
}, 2_000, 'validateWidgets');
//#endregion
</script>
