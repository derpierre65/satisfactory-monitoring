<template>
  <div class="text-center">
    <span>Days since last Incident:</span>
    <div class="text-h3">
      {{ sessionInfo.NumberOfDaysSinceLastDeath }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import { GetSessionInfoResponse } from '@derpierre65/ficsit-remote-monitoring';

const sessionInfo = useFRMEndpoint<GetSessionInfoResponse>('getSessionInfo', {} as GetSessionInfoResponse);
</script>
