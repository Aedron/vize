/* eslint-disable */
import './index.scss';
import * as React from 'react';
import * as R from 'ramda';
import { ComponentInstance, Maybe } from '@vize/types';
import { IHotArea, IHotAreaPosition, IHotAreaSize, MoveHotAreaDirection } from './types';
import { Modal, Spin } from 'antd';
import { getImageSrc, getOffsetToViewport } from 'utils';
import { events, EventEmitTypes } from 'libs';
import { i18n } from '@vize/i18n';
import {
  createHotArea,
  copyHotArea as iCopyHotArea,
  getMovedHotArea,
  transformHotAreaFromPxToPercent,
  transformHotAreaFromPercentToPx,
} from './utils';
import { selectStore, hotAreaStore } from 'states';
import { HotAreaItem } from './HotAreaItem';

class State {
  visible = false;

  loaded = false;

  selectedIndex = -1;

  hotAreas: IHotArea[] = [];
}

interface ImgInfo {
  width: number;
  height: number;
  left: number;
  top: number;
}

function getMousePosition<T extends HTMLElement = HTMLDivElement>(
  event: React.MouseEvent,
  { top, left }: ImgInfo,
): IHotAreaPosition {
  const { clientX, clientY } = event;
  return { x: clientX - left, y: clientY - top };
}

export class HotAreaManager extends React.Component {
  private instance: Maybe<ComponentInstance> = null;

  private imgContainerRef: Maybe<HTMLDivElement> = null;

  private imgContainerInfo: ImgInfo = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  };

  private src: Maybe<string> = null;

  public state = new State();

  private scrollTop = 0;

  private movingHotArea: Maybe<IHotArea> = null;

  private mouseDownEvent: Maybe<React.MouseEvent<HTMLDivElement>> = null;

  private maxWidth = 0;

  private maxHeight = 0;

  private added = false;

  public componentDidMount(): void {
    events.on(EventEmitTypes.MANAGE_HOT_AREA, (instance: ComponentInstance) => {
      if (!instance.hotAreas || !instance.data.src) {
        return;
      }
      this.instance = instance;
      this.src = getImageSrc(instance);
      this.setState({ selectedIndex: selectStore.hotAreaIndex, visible: true, loaded: false });
    });
  }

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.mouseDownEvent = e;
    this.movingHotArea = null;
  };

  private onCloseModal = () => {
    this.setState({ visible: false });
  };

  private onConfirmModal = () => {
    const {
      imgContainerInfo,
      state: { hotAreas: iHotAreas, selectedIndex },
    } = this;
    const hotAreas = transformHotAreaFromPxToPercent(iHotAreas, imgContainerInfo);

    hotAreaStore.setCurrentComponentHotAreas(hotAreas);
    selectStore.selectHotArea(selectedIndex, this.instance!.key);
    this.onCloseModal();
  };

  private afterCloseModal = () => {
    // do nothing.
  };

  private onScroll = () => {
    // do nothing.
  };

  private onImgLoaded = () => {
    setTimeout(() => {
      if (!this.instance || !this.instance.hotAreas) {
        return;
      }

      const { clientWidth: width, clientHeight: height } = this.imgContainerRef!;
      const { top, left } = getOffsetToViewport(this.imgContainerRef!);
      this.imgContainerInfo = {
        width,
        height,
        top,
        left,
      };

      this.setState({
        loaded: true,
        hotAreas: transformHotAreaFromPercentToPx(this.instance.hotAreas, this.imgContainerInfo),
      });
    }, 600);
  };

  private onMouseUp = () => {
    this.mouseDownEvent = null;
    this.movingHotArea = null;
    this.added = false;
    this.maxWidth = this.maxHeight = 0;
  };

  private setSizeAndPosition = (index: number, size: IHotAreaSize, position?: IHotAreaPosition) => {
    const { hotAreas } = this.state;
    const area = hotAreas[index];
    const newArea = { ...area, size, position: position || area.position };
    this.setState({
      hotAreas: R.update(index, newArea, hotAreas),
    });
  };

  private onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { mouseDownEvent } = this;
    if (!mouseDownEvent) {
      return;
    }

    const { movingHotArea, imgContainerInfo, added } = this;
    const mousePosition = getMousePosition(e, imgContainerInfo);

    if (this.scrollTop) {
      mousePosition.y += this.scrollTop;
    }

    if (!movingHotArea) {
      this.movingHotArea = createHotArea(mousePosition, { width: 1, height: 1 });
      const {
        position: { x, y },
      } = this.movingHotArea as IHotArea;
      this.maxWidth = imgContainerInfo.width - x;
      this.maxHeight = imgContainerInfo.height - y;
    } else {
      const width = Math.max(mousePosition.x - movingHotArea.position.x, 1);
      const height = Math.max(mousePosition.y - movingHotArea.position.y, 1);

      if (width < 5 && height < 5) return;

      if (!added) {
        const hotAreas = [...this.state.hotAreas, movingHotArea];
        this.setState({
          hotAreas,
          selectedIndex: hotAreas.length - 1,
        });
        this.added = true;
      } else {
        this.setSizeAndPosition(this.state.hotAreas.length - 1, {
          width: Math.min(width, this.maxWidth),
          height: Math.min(height, this.maxHeight),
        });
      }
    }
  };

  private deleteHotArea = (index: number) => {
    const { hotAreas } = this.state;
    this.setState({
      hotAreas: R.remove(index, 1, hotAreas),
      selectedIndex: -1,
    });
  };

  private moveHotArea = (index: number, direction: MoveHotAreaDirection) => {
    const { hotAreas } = this.state;
    this.setState({
      hotAreas: R.update(
        index,
        getMovedHotArea(direction, this.state.hotAreas[index] as IHotArea, this.imgContainerInfo),
        hotAreas,
      ),
    });
  };

  private setPosition = (index: number, position: IHotAreaPosition) => {
    const { hotAreas } = this.state;
    const area = hotAreas[index];
    const newArea = { ...area, position };
    this.setState({
      hotAreas: R.update(index, newArea, hotAreas),
    });
  };

  private renderHotAreas = () => {
    const {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      copyHotArea,
      deleteHotArea,
      moveHotArea,
      setPosition,
      setSizeAndPosition,
      state: { selectedIndex, hotAreas },
    } = this;
    return (
      <div className="hot-area-manager-mask" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        {hotAreas.map((area, index) => (
          <HotAreaItem
            key={area.key}
            hotArea={area}
            index={index}
            copyHotArea={copyHotArea}
            deleteHotArea={deleteHotArea}
            moveHotArea={moveHotArea}
            setPosition={setPosition}
            setSizeAndPosition={setSizeAndPosition}
            activated={index === selectedIndex}
            onClick={() => this.setState({ selectedIndex: index })}
          />
        ))}
      </div>
    );
  };

  private copyHotArea = (index: number) => {
    const { hotAreas } = this.state;
    const area = iCopyHotArea(hotAreas[index]);
    this.setState({
      hotAreas: [...hotAreas, area],
      selectedIndex: index,
    });
  };

  private renderLoading = () => <Spin className="hot-area-manager-loading" />;

  private renderContent = () => {
    if (!this.src) {
      return null;
    }

    return (
      <div className="hot-area-manager" onScroll={this.onScroll}>
        <div ref={node => (this.imgContainerRef = node)}>
          <img src={this.src} alt="hot-area-image" onLoad={this.onImgLoaded} />
          {this.state.loaded ? this.renderHotAreas() : this.renderLoading()}
        </div>
      </div>
    );
  };

  public render() {
    return (
      <Modal
        width="auto"
        title={i18n.t('Hotarea Manager')}
        wrapClassName="hot-area-manager-modal"
        visible={this.state.visible}
        maskClosable={false}
        onCancel={this.onCloseModal}
        onOk={this.onConfirmModal}
        closable={false}
        afterClose={this.afterCloseModal}
        destroyOnClose
      >
        {this.renderContent()}
      </Modal>
    );
  }
}
