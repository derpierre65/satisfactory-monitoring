import { useFRMEndpoint } from 'src/composables/frmEndpoint';
import { Endpoint, GetGeneratorsResponse } from '@derpierre65/ficsit-remote-monitoring';
import { computed } from 'vue';

function usePowerInformation() {
  const generators = useFRMEndpoint<GetGeneratorsResponse>(Endpoint.GetGenerators);

  const generatedPowerByGenerator = computed(() => {
    const grouped = Object.groupBy(generators.value, (value) => {
      return value.ClassName;
    });

    const result = {};
    for (const group of Object.keys(grouped)) {
      result[group] = grouped[group].reduce((previous, current) => {
        previous.totalPotential += current.BaseProd;
        if (current.CanStart) {
          previous.total += current.BaseProd;
        }

        return previous;
      }, {
        name: grouped[group]?.[0]?.Name,
        className: group,
        total: 0,
        totalPotential: 0,
      });
    }

    return Object.values(result).filter((group) => group.total);
  });

  return generatedPowerByGenerator;
}

export {
  usePowerInformation,
};
