import { Dialog, Loading, QSelectProps } from 'quasar';
import DashboardWidgetDialogEdit from 'components/dashboard/DashboardWidgetDialogEdit.vue';
import FRM from 'src/utils/FRM.ts';
import useServerStore from 'stores/server.ts';
import { computed, ComputedRef } from 'vue';
import useDataStore from 'stores/data.ts';
import { GetSwitchesResponse } from '@derpierre65/ficsit-remote-monitoring';
import PowerSwitchSwitcher from 'components/widgets/power-switch/PowerSwitchSwitcher.vue';
import SinkCouponStatus from 'components/widgets/sink/SinkCouponStatus.vue';
import SinkCouponProgress from 'components/widgets/sink/SinkCouponProgress.vue';
import SinkGraph from 'components/widgets/sink/SinkGraph.vue';
import SessionLastIncident from 'components/widgets/session/SessionLastIncident.vue';
import SessionGameTime from 'components/widgets/session/SessionGameTime.vue';
import SessionPlaytime from 'components/widgets/session/SessionPlaytime.vue';

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

// region sink widgets
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
// endregion

// region power widgets
registerWidget({
  id: 'power-switch-witcher',
  title: 'Power Switch Switcher',
  component: PowerSwitchSwitcher,
  category: 'power',
  layoutInfo: {
    minW: 4,
    minH: 2,
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
// endregion

// region session widgets
registerWidget({
  id: 'session-last-incident',
  title: 'Last Incident',
  category: 'session',
  endpoints: [ 'getSessionInfo', ],
  component: SessionLastIncident,
  layoutInfo: {
    minW: 2,
    minH: 4,
  },
});
registerWidget({
  id: 'session-game-time',
  title: 'Game Time',
  category: 'session',
  endpoints: [ 'getSessionInfo', ],
  component: SessionGameTime,
  layoutInfo: {
    minW: 2,
    minH: 3,
  },
});
registerWidget({
  id: 'session-play-time',
  title: 'Play time',
  category: 'session',
  endpoints: [ 'getSessionInfo', ],
  component: SessionPlaytime,
  layoutInfo: {
    minW: 2,
    minH: 2,
  },
});
// endregion

export {
  widgets,
  openEditWidget,
  type Widget,
  type WidgetConfiguration,
  type WidgetConfigurationData,
  type GridLayoutEntry,
};
