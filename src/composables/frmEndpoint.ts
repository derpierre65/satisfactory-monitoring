import { computed, onScopeDispose, ref } from 'vue';
import useDataStore from 'stores/data.ts';

function useFRMEndpoint<T>(endpoint: string) {
  const dataStore = useDataStore();

  dataStore.addEndpoint(endpoint);

  onScopeDispose(() => {
    dataStore.removeEndpoint(endpoint);
  });

  return computed<T | null>(() => (dataStore.apiData[endpoint] as T) || []);
}

function usePausableFRMEndpoint<T>(endpoint: string) {
  const dataStore = useDataStore();
  const isActive = ref(false);

  function resume() {
    if (isActive.value) {
      return;
    }

    dataStore.addEndpoint(endpoint);
    isActive.value = true;
  }

  function pause() {
    if (!isActive.value) {
      return;
    }

    dataStore.removeEndpoint(endpoint);
    isActive.value = false;
  }

  onScopeDispose(() => {
    if (isActive.value) {
      dataStore.removeEndpoint(endpoint);
    }
  });

  const data = computed(() => {
    if (!isActive.value) {
      return [] as T;
    }

    return (dataStore.apiData[endpoint] || []) as T;
  });

  resume();

  return {
    resume,
    pause,
    data,
    isActive,
  };
}

export {
  useFRMEndpoint,
  usePausableFRMEndpoint,
};
