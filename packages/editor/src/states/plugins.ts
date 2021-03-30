import { action, computed } from 'mobx';
import { EventInstance, Maybe, PluginInstance } from 'types';
import { getMaterialsPluginMeta } from 'runtime';
import {
  createPluginInstance,
  DepsTargetType,
  getCurrentPagePluginIndex,
  pluginEventDepsMap,
  regenerateCurrentPagePluginIndexMap,
  setCurrentPagePluginIndex,
} from '../utils';
import { selectStore, SelectType } from './select';
import { pagesStore } from './pages';
import { eventStore } from './events';
import { StoreWithUtils } from './utils';

export class PluginsStore extends StoreWithUtils<PluginsStore> {
  @computed
  public get pluginInstances(): PluginInstance[] {
    return pagesStore.currentPage.pluginInstances;
  }

  @action
  public setCurrentPagePluginInstances = (setter: (pluginInstances: PluginInstance[]) => PluginInstance[] | void) => {
    const page = pagesStore.pages[selectStore.pageIndex];
    const newInstances = setter(page.pluginInstances);
    if (newInstances) {
      page.pluginInstances = newInstances;
    }
    return newInstances;
  };

  @action
  public addPluginInstance = (pluginID: string) => {
    const plugin = getMaterialsPluginMeta(pluginID)!;
    const instance = createPluginInstance(plugin);

    this.setCurrentPagePluginInstances(pluginInstances => {
      pluginInstances.push(instance);
      setCurrentPagePluginIndex(instance.key, pluginInstances.length - 1);
    });

    selectStore.selectPlugin(instance.key);
    pluginEventDepsMap.createEventDepsMap(instance.key);
  };

  @action
  public deletePluginInstance = (key: number) => {
    const index = getCurrentPagePluginIndex(key)!;

    this.setCurrentPagePluginInstances(pluginInstances => {
      pluginInstances.splice(index, 1);
      regenerateCurrentPagePluginIndexMap(pluginInstances);
    });

    selectStore.selectPage(selectStore.pageIndex);
    eventStore.deleteDepsEventInstances(DepsTargetType.Plugin, key);
    pluginEventDepsMap.deleteEventDepsMap(key);
  };

  public getCurrentPagePluginInstance = (key: number): PluginInstance => {
    const index = getCurrentPagePluginIndex(key)!;
    return this.pluginInstances[index];
  };

  public getCurrentPluginInstance = (): Maybe<PluginInstance> => {
    const { selectType, pluginKey } = selectStore;
    return selectType === SelectType.PLUGIN ? this.getCurrentPagePluginInstance(pluginKey) : null;
  };

  @action
  public setPluginInstancePropsByKey = (key: number, setter: (instance: PluginInstance) => void) => {
    const instance = this.getCurrentPagePluginInstance(key);
    setter(instance);
    return instance;
  };

  @action
  private setCurrentPluginInstanceProps = (setter: (instance: PluginInstance) => void) => {
    const instance = this.getCurrentPagePluginInstance(selectStore.pluginKey);
    setter(instance);
    return instance;
  };

  @action
  public setCurrentPluginInstanceData = (data: object) => {
    return this.setCurrentPluginInstanceProps(instance => {
      instance.data = data;
    });
  };

  @action
  public setCurrentPluginInstanceEvents = (setter: (events: EventInstance[]) => EventInstance[] | void) => {
    return this.setCurrentPluginInstanceProps(instance => {
      const newEvents = setter(instance.events);
      if (newEvents) {
        instance.events = newEvents;
      }
      return instance;
    });
  };
}

export const pluginsStore = new PluginsStore();
