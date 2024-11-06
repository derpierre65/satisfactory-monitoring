<template>
  <div class="text-center full-height tw-flex tw-flex-col tw-justify-center">
    <div class="text-h4">
      {{ gameTime }}
    </div>
    <div>{{ sessionInfo.IsDay ? 'Day' : 'Night' }}</div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import { GetSessionInfoResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed } from 'vue';

const sessionInfo = useFRMEndpoint<GetSessionInfoResponse>('getSessionInfo', {} as GetSessionInfoResponse);

const gameTime = computed(() => {
  return [
    ('0' + sessionInfo.value.Hours).slice(-2),
    ('0' + sessionInfo.value.Minutes).slice(-2),
    ('0' + Math.floor(sessionInfo.value.Seconds)).slice(-2),
  ].join(':');
});
</script>
