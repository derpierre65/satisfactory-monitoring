import { Dialog, Loading, QSelectProps } from 'quasar';
import DashboardWidgetDialogEdit from 'components/dashboard/DashboardWidgetDialogEdit.vue';
import FRM from 'src/utils/FRM.ts';
import useServerStore from 'stores/server.ts';
import useDataStore from 'stores/data.ts';
import { computed, ComputedRef } from 'vue';
import PowerSwitchSwitcher from 'components/widgets/power-switch/PowerSwitchSwitcher.vue';
import { GetSwitchesResponse } from '@derpierre65/ficsit-remote-monitoring';
import registerSinkWidgets from 'src/utils/dashboard/widgets/sink.ts';

type WidgetConfiguration = ({
  type: 'select';
  fromEndpoint: string;
  optionValue: QSelectProps['optionValue'];
  optionLabel: QSelectProps['optionLabel'];
  options?: QSelectProps['options'];
}) & {
  id: string;
  label: string;
  required: true;
};

type GridLayoutEntry = {
  id: string;
  x: number;
  y: number;
  h: number;
  w: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
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

async function openEditWidget(widget: Widget) {
  if (!widget.configuration) {
    return {
      onOk: (cb: () => WidgetConfigurationData) => cb({}),
    };
  }

  const serverStore = useServerStore();

  Loading.show({
    group: 'openEditWidget',
  });

  const endpointData = Object.create(null);
  for (const configuration of widget.configuration) {
    if (configuration.fromEndpoint && !endpointData[configuration.fromEndpoint]) {
      endpointData[configuration.fromEndpoint] = await FRM.fetch(serverStore.currentApiUrl, configuration.fromEndpoint);
    }
  }

  Loading.hide('openEditWidget');

  return Dialog.create({
    component: DashboardWidgetDialogEdit,
    componentProps: {
      endpointData,
      widget,
    },
  });
}

function registerWidget(data: Widget) {
  // @ts-ignore i don't care about the readonly here.
  widgets[data.id] = data;
}

registerWidget({
  id: 'power-switch-witcher',
  title: 'Power Switch Switcher',
  component: PowerSwitchSwitcher,
  category: 'power',
  layoutInfo: {
    minW: 4,
    minH: 3,
    maxH: 4,
  },
  configuration: [
    {
      id: 'switchId',
      label: 'Power Switch',
      required: true,
      type: 'select',
      fromEndpoint: 'getSwitches',
      optionValue: 'ID',
      optionLabel: (powerSwitch) => powerSwitch.Name || 'Unnamed Switch',
    },
  ],
  endpoints: [ 'getSwitches', ],
  isValid(configuration) {
    const dataStore = useDataStore();
    const switches = dataStore.apiData.getSwitches as GetSwitchesResponse;
    if (!switches) {
      return null;
    }

    return switches.some((powerSwitch) => powerSwitch.ID === configuration.switchId);
  },
  props(configuration: WidgetConfigurationData) {
    const dataStore = useDataStore();

    return computed(() => {
      const getSwitches = dataStore.apiData.getSwitches as GetSwitchesResponse;
      const item = getSwitches?.find((powerSwitch) => powerSwitch.ID === configuration.switchId);
      if (!item) {
        return null;
      }

      return {
        item,
      };
    });
  },
});

registerSinkWidgets();

export {
  widgets,
  openEditWidget,
  registerWidget,
  type Widget,
  type WidgetConfiguration,
  type WidgetConfigurationData,
  type GridLayoutEntry,
};
