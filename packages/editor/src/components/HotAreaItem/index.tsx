import './index.scss';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { editStore, globalStore, pagesStore, selectStore } from 'states';
import classnames from 'classnames';
import { FirstParameter, HotArea } from '@vize/types';
import { preventSyntheticEvent } from 'utils';
import { observer } from 'mobx-react';
import { NodeEventProxy, percent } from '@vize/runtime-web';
import { Trans } from 'react-i18next';
import { showHotAreaContextMenu } from '../ContextMenu';

interface Props {
  index: number;
  componentInstanceKey: number;
  hotArea: HotArea;
}

function IHotAreaItem({ index, componentInstanceKey, hotArea }: Props) {
  const { componentKey, hotAreaIndex } = selectStore;
  const { globalData, globalStyle, metaInfo } = globalStore;
  const { previewMode } = editStore;
  const {
    router,
    currentPage: { data: pageData, style: pageStyle },
  } = pagesStore;

  const selected = componentKey === componentInstanceKey && index === hotAreaIndex;

  const onClick = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      if (previewMode) {
        return;
      }
      preventSyntheticEvent(e);
      selectStore.selectHotArea(index, componentInstanceKey);
    },
    [previewMode],
  );

  const onContextMenu = useCallback(
    (e: FirstParameter<typeof showHotAreaContextMenu>) => {
      showHotAreaContextMenu(e, index, componentInstanceKey, true);
    },
    [index, componentInstanceKey],
  );

  const { size, position, key } = hotArea;
  const style = useMemo(
    () => ({
      width: percent(size.width),
      height: percent(size.height),
      left: percent(position.x),
      top: percent(position.y),
    }),
    [size, position],
  );

  if (previewMode) {
    return (
      <NodeEventProxy<HotArea>
        className="hotarea-event-proxy"
        childrenType="hotarea"
        instance={hotArea}
        meta={metaInfo}
        globalData={globalData}
        globalStyle={globalStyle}
        pageData={pageData}
        pageStyle={pageStyle}
        router={router}
        previewMode={previewMode}
        style={style}
      />
    );
  }

  return (
    <div
      className={classnames('vize-component-item-hotarea', { selected })}
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={style}
    >
      <p>
        <Trans>Hotarea</Trans>（key={key}）
      </p>
    </div>
  );
}

export const HotAreaItem = observer(IHotAreaItem);
