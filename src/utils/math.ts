import { computed, ComputedRef } from 'vue';

function getTotalInfo<T extends Record<string, any>>(data: ComputedRef<T[] | null>, key: keyof T) {
  return computed(() => {
    if (!data.value) {
      return 0;
    }

    return Math.floor(data.value.reduce((previous, current) => previous + current[key], 0));
  });
}

export {
  getTotalInfo,
};
