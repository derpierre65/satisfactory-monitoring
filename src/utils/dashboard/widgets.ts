import { Dialog, Loading } from 'quasar';
import DashboardWidgetDialogEdit from 'components/dashboard/DashboardWidgetDialogEdit.vue';
import FRM from 'src/utils/FRM.ts';
import useServerStore from 'stores/server.ts';
import useDataStore from 'stores/data.ts';
import { computed, DefineComponent } from 'vue';
import PowerSwitchSwitcher from 'components/widgets/power-switch/PowerSwitchSwitcher.vue';
import SinkCouponStatus from 'components/widgets/sink/SinkCouponStatus.vue';
import SinkCouponProgress from 'components/widgets/sink/SinkCouponProgress.vue';
import SinkGraph from 'components/widgets/sink/SinkGraph.vue';

type WidgetConfiguration = ({
  type: 'select';
  fromEndpoint: string;
  optionValue: string;
  optionLabel: string;
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

type WidgetConfigurationData = Record<string, unknown>;

type Widget = {
  id: string;
  title: string;
  component: string | DefineComponent;
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
  isValid?: (configuration: WidgetConfigurationData) => boolean | null;
};

const widgets: Readonly<Record<string, Readonly<Widget>>> = {};

async function openEditWidget(widget: Widget) {
  if (!widget.configuration) {
    return {
      onOk: (cb) => cb({}),
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
  widgets[data.id] = data;
}

registerWidget({
  id: 'awesome-sink-coupon-status',
  title: 'AWESOME Sink Coupons',
  component: SinkCouponStatus,
  category: 'sink',
  layoutInfo: {
    minH: 5,
    minW: 2,
  },
});

registerWidget({
  id: 'awesome-sink-coupon-progress',
  title: 'AWESOME Sink Coupon Progress',
  component: SinkCouponProgress,
  category: 'sink',
  layoutInfo: {
    minW: 4,
    minH: 5,
  },
});

registerWidget({
  id: 'awesome-sink-graph',
  title: 'AWESOME Sink Graph',
  component: SinkGraph,
  category: 'sink',
  layoutInfo: {
    minW: 4,
    minH: 6,
  },
});

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
    if (!dataStore.apiData.getSwitches) {
      return null;
    }

    return dataStore.apiData.getSwitches.some((powerSwitch) => powerSwitch.ID === configuration.switchId);
  },
  props(configuration) {
    const dataStore = useDataStore();

    return computed(() => {
      const item = dataStore.apiData.getSwitches?.find((powerSwitch) => powerSwitch.ID === configuration.switchId);
      if (!item) {
        return null;
      }

      return {
        item,
      };
    });
  },
});

export {
  widgets,
  openEditWidget,
  type Widget,
  type WidgetConfiguration,
  type GridLayoutEntry,
};
