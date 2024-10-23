import { PowerSlug, PowerSlugObject } from '@derpierre65/ficsit-remote-monitoring';

function getSlugColor(slug: PowerSlugObject) {
  if (slug.ClassName === PowerSlug.Blue) {
    return 'blue';
  }
  if (slug.ClassName === PowerSlug.Yellow) {
    return 'yellow';
  }
  if (slug.ClassName === PowerSlug.Purple) {
    return 'purple';
  }

  return 'unknown';
}

export {
  getSlugColor,
};
