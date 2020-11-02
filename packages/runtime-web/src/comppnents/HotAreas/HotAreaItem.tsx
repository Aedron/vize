import * as React from 'react';
import { useMemo } from 'react';
import { ComponentInstance, HotArea } from '../../../types';
import { NodeEventProxy } from '../NodeEventProxy';
import { AppRenderProps } from '../AppRender/types';

interface Props extends Pick<AppRenderProps, 'global' | 'meta' | 'router'> {
  componentInstance: ComponentInstance;
  hotArea: HotArea;
}

export function HotAreaItem({ hotArea, global, meta, router }: Props) {
  const { size, position } = hotArea;
  const style = useMemo(
    () => ({
      width: percent(size.width),
      height: percent(size.height),
      left: percent(position.x),
      top: percent(position.y),
    }),
    [size, position],
  );

  return (
    <NodeEventProxy<HotArea>
      className="hotarea-event-proxy"
      childrenType="hotarea"
      instance={hotArea}
      style={style}
      global={global}
      meta={meta}
      router={router}
      previewMode={false}
    />
  );
}

export function percent(percent: number): string {
  return `${percent}%`;
}
