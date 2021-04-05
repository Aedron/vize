import * as React from 'react';
import { useCallback } from 'react';
import { observer } from 'mobx-react';
import { getMaterialsContainerMeta, EventEmitTypes, events } from 'libs';
import { pagesStore } from 'states';
import { i18n } from 'i18n';
import { Empty } from 'widgets/Empty';
import { SchemaForm } from 'widgets/Form';

function IPageDataForm() {
  const { pageDataForm } = getMaterialsContainerMeta()!;
  const {
    currentPage: { data },
    setCurrentPageData,
  } = pagesStore;

  const onChange = useCallback((v: object) => {
    setCurrentPageData(v);
    events.emit(EventEmitTypes.RELOAD_RENDERER);
  }, []);

  if (!pageDataForm) {
    return <Empty text={i18n.t('Not available')} />;
  }

  return (
    <div className="editor-prop-item editor-prop-edit-data">
      <SchemaForm form={pageDataForm} data={data} onChange={onChange} submitProps />
    </div>
  );
}

export const PageDataForm = observer(IPageDataForm);
