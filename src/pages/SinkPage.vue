<template>
  <div class="tw-max-w-screen-xl tw-mx-auto tw-grid md:tw-grid-cols-4 tw-gap-4">
    <SinkGraph class="md:tw-col-span-3" />

    <div>
      <SinkCouponStatus />
      <SinkCouponProgress class="q-mt-md q-mx-auto tw-w-[300px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SinkGraph from 'components/widgets/sink/SinkGraph.vue';
import SinkCouponStatus from 'components/widgets/sink/SinkCouponStatus.vue';
import SinkCouponProgress from 'components/widgets/sink/SinkCouponProgress.vue';
</script>
