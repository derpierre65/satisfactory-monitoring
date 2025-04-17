import { registerWidget } from 'src/utils/dashboard/widgets';
import { defineAsyncComponent } from 'vue';

export default function registerSessionWidgets() {
  registerWidget({
    id: 'session_last_incident',
    category: 'session',
    endpoints: [ 'getSessionInfo', ],
    component: defineAsyncComponent(() => import('components/widgets/session/SessionLastIncident.vue')),
    layoutInfo: {
      minW: 4,
      minH: 6,
    },
  });
  registerWidget({
    id: 'session_game_time',
    category: 'session',
    endpoints: [ 'getSessionInfo', ],
    component: defineAsyncComponent(() => import('components/widgets/session/SessionGameTime.vue')),
    layoutInfo: {
      minW: 4,
      minH: 6,
    },
  });
  registerWidget({
    id: 'session_play_time',
    category: 'session',
    endpoints: [ 'getSessionInfo', ],
    component: defineAsyncComponent(() => import('components/widgets/session/SessionPlaytime.vue')),
    layoutInfo: {
      minW: 4,
      minH: 6,
    },
  });
}
