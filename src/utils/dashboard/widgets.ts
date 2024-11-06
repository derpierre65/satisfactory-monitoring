import { Dialog, Loading, QSelectProps } from 'quasar';
import DashboardWidgetDialogEdit from 'components/dashboard/DashboardWidgetDialogEdit.vue';
import FRM from 'src/utils/FRM.ts';
import useServerStore from 'stores/server.ts';
import { ComputedRef } from 'vue';
import registerSessionWidgets from 'src/utils/dashboard/widgets/session.ts';
import registerPowerWidgets from 'src/utils/dashboard/widgets/power.ts';
import registerSinkWidgets from 'src/utils/dashboard/widgets/sink.ts';
import registerInventoryWidgets from 'src/utils/dashboard/widgets/inventory.ts';

type WidgetConfiguration = {
  id: string;
  label: string;
  required?: boolean;
} & ({
  type: 'select';
  fromEndpoint: string;
  optionValue: QSelectProps['optionValue'];
  optionLabel: QSelectProps['optionLabel'];
  options?: QSelectProps['options'];
} | {
  type: 'boolean';
});

type GridLayoutEntry = {
  id: string;
  x: number;
  y: number;
  h: number;
  w: number;
  minW: number;
  maxW?: number;
  minH: number;
  maxH?: number;
};

type Widget = {
  id: string;
  title: string;
  component: unknown;
  category: string;
  layoutInfo: {
    h?: number;
    w?: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
  };
  endpoints?: string[];
  configuration?: WidgetConfiguration[];
  props?: (configuration: WidgetConfigurationData) => ComputedRef<Record<string, unknown> | null>;
  isValid?: (configuration: WidgetConfigurationData) => boolean | null;
};

type WidgetConfigurationData = Record<string, string | number | boolean>;

const widgets: Readonly<Record<string, Readonly<Widget>>> = {};

async function openEditWidget(widget: Widget, settings: WidgetConfigurationData = {}) {
  if (!widget.configuration) {
    return {
      onOk: (cb: (data: WidgetConfigurationData) => void) => cb({} as WidgetConfigurationData),
    };
  }

  const serverStore = useServerStore();

  Loading.show({
    group: 'openEditWidget',
  });

  const endpointData = Object.create(null);

  try {
    for (const configuration of widget.configuration) {
      if (configuration.type === 'select' && configuration.fromEndpoint && !endpointData[configuration.fromEndpoint]) {
        endpointData[configuration.fromEndpoint] = await FRM.fetch(serverStore.currentApiUrl, configuration.fromEndpoint);
      }

      if (configuration.type === 'boolean' && typeof settings[configuration.id] === 'undefined') {
        settings[configuration.id] = false;
      }
    }
  }
  catch (error) {
    console.error(error);

    return {
      onOk: () => null,
    };
  }
  finally {
    Loading.hide('openEditWidget');
  }

  return Dialog.create({
    component: DashboardWidgetDialogEdit,
    componentProps: {
      defaultSettings: settings,
      endpointData,
      widget,
    },
  });
}

function registerWidget(data: Widget) {
  // @ts-ignore i don't care about the readonly here.
  widgets[data.id] = data;
}

registerSinkWidgets();
registerSessionWidgets();
registerPowerWidgets();
registerInventoryWidgets();

export {
  widgets,
  openEditWidget,
  registerWidget,
  type Widget,
  type WidgetConfiguration,
  type WidgetConfigurationData,
  type GridLayoutEntry,
};
