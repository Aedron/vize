import { ComponentInstance, PluginInstance } from 'types';
import { getMaterialsComponentMeta, getMaterialsPluginMeta } from 'runtime';

export function filterComponent(i: ComponentInstance) {
  const meta = getMaterialsComponentMeta(i.component);
  if (!meta) {
    console.error(`Component "${i.component}" not found`);
  }
  return !!meta;
}

export function filterPlugin(i: PluginInstance) {
  const meta = getMaterialsPluginMeta(i.plugin);
  if (!meta) {
    console.error(`Plugin "${i.plugin}" not found`);
  }
  return !!meta;
}
