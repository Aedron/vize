import * as React from 'react';
import { useEffect } from 'react';
import { FiEdit, FiEye, FiMaximize2 } from 'react-icons/fi';
import { editStore } from 'states';
import { toggleFullScreen, withMessage } from 'utils';
import { hotkeyEvents, HotKeyEventTypes } from 'libs';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { hotKeyPrefix } from './utils';
import { OperationItem } from './OperationItem';

function IToggle() {
  const { t } = useTranslation();
  const { previewMode } = editStore;

  useEffect(() => {
    hotkeyEvents.only(
      HotKeyEventTypes.TOGGLE_PREVIEW,
      withMessage(editStore.togglePreviewMode, () =>
        t('switch to {{type}} mode', { type: editStore.previewMode ? 'preview' : 'edit' }),
      ),
    );
    hotkeyEvents.only(HotKeyEventTypes.TOGGLE_FULLSCREEN, withMessage(toggleFullScreen, t('toggle fullscreen')));
  }, []);

  return (
    <>
      <OperationItem
        title={
          <>
            <p>{t('switch to {{type}} mode', { type: previewMode ? 'preview' : 'edit' })}</p>
            <p className="desc">({hotKeyPrefix} + P)</p>
          </>
        }
        icon={previewMode ? FiEdit : FiEye}
        action={editStore.togglePreviewMode}
      />
      <OperationItem
        title={
          <>
            <p>
              <Trans>toggle fullscreen</Trans>
            </p>
            <p className="desc">({hotKeyPrefix} + F)</p>
          </>
        }
        icon={FiMaximize2}
        action={toggleFullScreen}
      />
      <span className="operation_black" />
    </>
  );
}

export const Toggle = observer(IToggle);
