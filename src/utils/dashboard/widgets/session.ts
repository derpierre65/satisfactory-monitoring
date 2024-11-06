import { registerWidget } from 'src/utils/dashboard/widgets.ts';
import { defineAsyncComponent } from 'vue';

export default function registerSessionWidgets() {
  registerWidget({
    id: 'session-last-incident',
    title: 'dashboard.widgets.session_last_incident.title',
    category: 'session',
    endpoints: [ 'getSessionInfo', ],
    component: defineAsyncComponent(() => import('components/widgets/session/SessionLastIncident.vue')),
    layoutInfo: {
      minW: 2,
      minH: 4,
    },
  });
  registerWidget({
    id: 'session-game-time',
    title: 'dashboard.widgets.session_game_time.title',
    category: 'session',
    endpoints: [ 'getSessionInfo', ],
    component: defineAsyncComponent(() => import('components/widgets/session/SessionGameTime.vue')),
    layoutInfo: {
      minW: 2,
      minH: 3,
    },
  });
  registerWidget({
    id: 'session-play-time',
    title: 'dashboard.widgets.session_play_time.title',
    category: 'session',
    endpoints: [ 'getSessionInfo', ],
    component: defineAsyncComponent(() => import('components/widgets/session/SessionPlaytime.vue')),
    layoutInfo: {
      minW: 2,
      minH: 3,
    },
  });
}
