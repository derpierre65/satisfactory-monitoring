import { computed, onScopeDispose, Reactive, ref, toValue, watch, watchEffect, WritableComputedRef } from 'vue';
import useDataStore from 'stores/data';

function useFRMEndpoint<T>(endpoint: string, { defaultValue, fetchEvery, }: {
  defaultValue?: T;
  fetchEvery?: number;
} = {}) {
  defaultValue ||= [] as T;
  fetchEvery ||= -1;

  const dataStore = useDataStore();

  const id = dataStore.addEndpoint(endpoint, fetchEvery);

  onScopeDispose(() => {
    dataStore.removeEndpoint(id);
  });

  return computed(() => (dataStore.apiData[endpoint] as T) || defaultValue);
}

function usePausableFRMEndpoint<T>(endpoint: string, { fetchDuration = -1, startPaused = false, } = {}) {
  const dataStore = useDataStore();
  const isActive = ref(false);
  const id = ref('');

  const data = computed(() => {
    return (dataStore.apiData?.[endpoint] || []) as T;
  });

  watch(isActive, (newValue) => {
    if (newValue) {
      resume();
    }
    else {
      pause();
    }
  });

  function resume() {
    if (id.value) {
      return;
    }

    id.value = dataStore.addEndpoint(endpoint, fetchDuration);
    isActive.value = true;
  }

  function pause() {
    if (!id.value) {
      return;
    }

    dataStore.removeEndpoint(id.value);
    isActive.value = false;
  }

  onScopeDispose(() => {
    if (id.value) {
      dataStore.removeEndpoint(id.value);
    }
  });

  if (!startPaused) {
    resume();
  }

  return {
    resume,
    pause,
    data,
    isActive,
  };
}

function useEndpointsByOptions<T extends Record<string, Reactive<ReturnType<typeof usePausableFRMEndpoint>>>, U extends Record<string, keyof T>>(
  options: WritableComputedRef<string[]>,
  endpoints: T,
  aliases: U = {} as U,
) {
  const aliasKeys = Object.keys(aliases);

  watchEffect(() => {
    const currentOptions = toValue(options) as Array<keyof typeof endpoints>;
    const availableEndpoints = Object.keys(endpoints) as Array<keyof typeof endpoints>;
    for (const endpoint of availableEndpoints) {
      const resume = currentOptions.includes(endpoint) || aliasKeys.some((alias) => {
        return aliases[alias] === endpoint && currentOptions.includes(alias);
      });

      endpoints[endpoint]?.[resume ? 'resume' : 'pause']();
    }
  });

  return {
    options,
  };
}

export {
  useEndpointsByOptions,
  useFRMEndpoint,
  usePausableFRMEndpoint,
};
