import { computed, ComputedRef, toValue } from 'vue';
import type { HasLocation, IDClassObject } from '@derpierre65/ficsit-remote-monitoring';

function buildIDCache(entity: IDClassObject) {
  return entity.ID;
}

function buildIDCacheWithLocation(entity: IDClassObject & HasLocation) {
  return entity.ID.toString() + entity.location.x + entity.location.z;
}

function useCacheComputed<T, U = T[]>(options: {
  obj: ComputedRef<T[]> | (() => T[]);
  buildCache: (entity: T) => string;
  formatValues: (data: T[]) => U;
  identifier?: keyof T;
}) {
  const {
    obj,
    buildCache,
    formatValues,
    identifier = 'ID' as keyof T,
  } = options;

  const dataComputed = computed((oldValue?: T[]) => {
    const newValue = toValue(obj);
    if (!newValue || newValue.length === 0) {
      return [] as T[];
    }

    if (!oldValue) {
      return newValue;
    }

    const oldValues: Record<string, {
      oldCacheValue: string;
      oldIndex: number;
    }> = {};

    for (const [ index, value, ] of (oldValue || []).entries()) {
      oldValues[value[identifier] as string] = {
        oldCacheValue: buildCache(value),
        oldIndex: index,
      };
    }

    let returnOldValue = newValue.length === oldValue.length;
    const newValues = [];
    for (const value of newValue) {
      const oldValueInfo = oldValues[value[identifier] as string];
      if (!oldValueInfo) {
        returnOldValue = false;
        newValues.push(value);
        continue;
      }

      const newCacheValue = buildCache(value);
      if (newCacheValue === oldValueInfo.oldCacheValue) {
        newValues.push(oldValue[oldValueInfo.oldIndex]);
      }
      else {
        newValues.push(value);
        returnOldValue = false;
      }
    }

    if (returnOldValue) {
      return oldValue;
    }

    return newValues;
  });

  return computed(() => {
    if (!formatValues) {
      return dataComputed.value as U;
    }

    return formatValues(dataComputed.value);
  });
}

export {
  useCacheComputed,
  buildIDCache,
  buildIDCacheWithLocation,
};
