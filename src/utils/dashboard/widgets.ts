import { ComputedRef } from 'vue';
import registerSessionWidgets from 'src/utils/dashboard/widgets/session';
import registerPowerWidgets from 'src/utils/dashboard/widgets/power';
import registerSinkWidgets from 'src/utils/dashboard/widgets/sink';
import registerInventoryWidgets from 'src/utils/dashboard/widgets/inventory';
import { ConfigurationData, CustomConfigurationItem } from 'src/utils/dashboard/configuration';

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
  configuration?: CustomConfigurationItem[];
  props?: ((configuration: ConfigurationData) => ComputedRef<Record<string, unknown> | null>) | object;
  isValid?: (configuration: ConfigurationData) => boolean | null;
};

const widgets: Readonly<Record<string, Readonly<Widget>>> = {};

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
  registerWidget,
  type Widget,
  type GridLayoutEntry,
};
