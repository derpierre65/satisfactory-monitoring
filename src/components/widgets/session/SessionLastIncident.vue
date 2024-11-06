<template>
  <div class="text-center">
    <span>{{ t('dashboard.widgets.session_last_incident.subtitle') }}:</span>
    <div class="text-h3">
      {{ sessionInfo.NumberOfDaysSinceLastDeath }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import { GetSessionInfoResponse } from '@derpierre65/ficsit-remote-monitoring';
import { useTranslation } from 'i18next-vue';

const sessionInfo = useFRMEndpoint<GetSessionInfoResponse>('getSessionInfo', {} as GetSessionInfoResponse);
const { t, } = useTranslation();
</script>
