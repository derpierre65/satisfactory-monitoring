import { HasLocation } from '@derpierre65/ficsit-remote-monitoring';

function getEntityLocation(entity: HasLocation): [number, number] {
  return [
    entity.location.y * -1,
    entity.location.x,
  ];
}

export {
  getEntityLocation,
};
