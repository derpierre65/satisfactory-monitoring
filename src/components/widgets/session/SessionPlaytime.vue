<template>
  <div class="text-center full-height tw-flex tw-flex-col tw-justify-center">
    <div class="text-h4">
      {{ sessionInfo.TotalPlayDurationText }}
    </div>
    <div>{{ t('dashboard.widgets.session_play_time.title') }}</div>
  </div>
</template>

<script setup lang="ts">
import { useFRMEndpoint } from 'src/composables/frmEndpoint.ts';
import { GetSessionInfoResponse } from '@derpierre65/ficsit-remote-monitoring';
import { useTranslation } from 'i18next-vue';

const sessionInfo = useFRMEndpoint<GetSessionInfoResponse>('getSessionInfo', {} as GetSessionInfoResponse);

const { t, } = useTranslation();
</script>
