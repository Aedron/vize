import * as React from 'react';
import { Tree } from 'antd';
import { observer } from 'mobx-react';
import { ComponentProps, useMemo } from 'react';
import { pluginsStore, selectStore, SelectType } from 'states';
import { FirstParameter, MustBe, PluginInstance } from '@vize/types';
import { FiFolder } from 'react-icons/fi';
import { PluginContextMenu, showPluginContextMenu } from 'components/ContextMenu';
import { i18n } from '@vize/i18n';
import { generatePluginTreeData } from './utils';

const { DirectoryTree } = Tree;

type TreeData = ComponentProps<typeof DirectoryTree>['treeData'];

interface PluginContextMenusProps {
  pluginInstances: PluginInstance[];
}

function PluginContextMenus({ pluginInstances }: PluginContextMenusProps) {
  return (
    <>
      {pluginInstances.map(i => (
        <PluginContextMenu key={i.key} instance={i} />
      ))}
    </>
  );
}

function IPluginsTree() {
  const { pluginInstances } = pluginsStore;
  const { selectType, pluginKey } = selectStore;

  const treeData = getTreeData(pluginInstances);
  const selectedKeys = useMemo<number[]>(() => (selectType === SelectType.PLUGIN ? [pluginKey] : []), [
    pluginKey,
    selectType,
  ]);

  return (
    <>
      <DirectoryTree
        className="plugins-tree"
        expandAction="doubleClick"
        defaultExpandAll
        // onSelect={onSelect}
        // onExpand={onExpand}
        treeData={treeData}
        selectedKeys={selectedKeys}
        onRightClick={onRightClick}
        onSelect={onSelect}
      />
      <PluginContextMenus pluginInstances={pluginInstances} />
    </>
  );
}

export const PluginsTree = observer(IPluginsTree);

function onSelect(...params: Parameters<MustBe<ComponentProps<typeof DirectoryTree>['onSelect']>>) {
  const [, { node }] = params;
  selectStore.selectPlugin(node.key as number);
}

function onRightClick({ node, event }: FirstParameter<MustBe<ComponentProps<typeof DirectoryTree>['onRightClick']>>) {
  const key = parseInt(node.key.toString(), 10);
  showPluginContextMenu(event, key);
}

function getTreeData(pluginInstances: PluginInstance[]): TreeData {
  return [
    {
      title: i18n.t('Added plugins'),
      key: 'plugins',
      isLeaf: false,
      icon: <FiFolder />,
      selectable: false,
      className: 'tree-root-node plugins-tree-root-node',
      children: generatePluginTreeData(pluginInstances),
    },
  ];
}
