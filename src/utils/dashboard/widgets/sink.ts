import { registerWidget } from 'src/utils/dashboard/widgets';
import { defineAsyncComponent } from 'vue';

export default function registerSinkWidgets() {
  registerWidget({
    id: 'awesome_sink_coupon_status',
    component: defineAsyncComponent(() => import('components/widgets/sink/SinkCouponStatus.vue')),
    category: 'sink',
    layoutInfo: {
      minW: 4,
      minH: 8,
    },
  });

  registerWidget({
    id: 'awesome_sink_coupon_progress',
    component: defineAsyncComponent(() => import('components/widgets/sink/SinkCouponProgress.vue')),
    category: 'sink',
    layoutInfo: {
      minW: 8,
      minH: 9,
    },
  });

  registerWidget({
    id: 'awesome_sink_graph',
    component: defineAsyncComponent(() => import('components/widgets/sink/SinkGraph.vue')),
    category: 'sink',
    layoutInfo: {
      minW: 8,
      minH: 10,
    },
  });
}
