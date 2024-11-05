import { registerWidget } from 'src/utils/dashboard/widgets.ts';
import { defineAsyncComponent } from 'vue';

function registerSinkWidgets() {
  registerWidget({
    id: 'awesome-sink-coupon-status',
    title: 'AWESOME Sink Coupons',
    component: defineAsyncComponent(() => import('components/widgets/sink/SinkCouponStatus.vue')),
    category: 'sink',
    layoutInfo: {
      minH: 5,
      minW: 2,
    },
  });

  registerWidget({
    id: 'awesome-sink-coupon-progress',
    title: 'AWESOME Sink Coupon Progress',
    component: defineAsyncComponent(() => import('components/widgets/sink/SinkCouponProgress.vue')),
    category: 'sink',
    layoutInfo: {
      minW: 4,
      minH: 5,
    },
  });

  registerWidget({
    id: 'awesome-sink-graph',
    title: 'AWESOME Sink Graph',
    component: defineAsyncComponent(() => import('components/widgets/sink/SinkGraph.vue')),
    category: 'sink',
    layoutInfo: {
      minW: 4,
      minH: 6,
    },
  });
}

export {
  registerSinkWidgets as default,
};
