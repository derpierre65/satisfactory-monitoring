import { boot } from 'quasar/wrappers';
import { QBtn, QDialog, QFile, QInput, QSelect, QTab, QToggle } from 'quasar';
import type { ComponentOptions } from 'vue';

function setDefault(component: ComponentOptions, key: string, value: boolean | string | number) {
  const prop = component.props[key];

  switch (typeof prop) {
    case 'object':
      prop.default = value;
      break;
    case 'function':
      component.props[key] = {
        type: prop,
        default: value,
      };
      break;
    case 'undefined':
      throw new Error(`Unknown prop: ${key}`);
    default:
      throw new Error(`Unhandled type: ${typeof prop}`);
  }
}

export default boot(() => {
  for (const component of [
    QInput,
    QSelect,
    QFile,
  ]) {
    setDefault(component, 'dense', true);
    setDefault(component, 'outlined', true);
  }
  for (const component of [
    QBtn,
    QTab,
  ]) {
    setDefault(component, 'noCaps', true);
  }

  setDefault(QDialog, 'noShake', true);
  setDefault(QToggle, 'dense', true);
});
