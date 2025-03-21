import { computed, onScopeDispose, Reactive, ref, toValue, watchEffect, WritableComputedRef } from 'vue';
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

function useEndpointsByOptions<T extends Record<string, Reactive<ReturnType<typeof usePausableFRMEndpoint>>>, U extends Record<string, keyof T>>(
  options: WritableComputedRef<string[]>,
  endpoints: T,
  aliases: U = {},
) {
  const aliasKeys = Object.keys(aliases);

  watchEffect(() => {
    const currentOptions = toValue(options) as Array<keyof typeof endpoints>;
    const availableEndpoints = Object.keys(endpoints) as Array<keyof typeof endpoints>;
    for (const endpoint of availableEndpoints) {
      const resume = currentOptions.includes(endpoint) || aliasKeys.some((alias) => aliases[alias] === endpoint);

      endpoints[endpoint][resume ? 'resume' : 'pause']();
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
