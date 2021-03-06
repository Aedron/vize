import './index.scss';
import * as React from 'react';
import { BizSelector } from 'components/BizSelector';
import { useCallback, useState } from 'react';
import { BizRecord, Maybe, PageRecordWithHistory } from 'types';
import { Spin, message, Pagination, Button, Empty } from 'antd';
import { useAsyncEffect } from 'hooks';
import { queryPages } from 'api';
import { BiPlus } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { Header } from '../Header';
import { FlexPlaceholder } from '../FlexPlaceholder';
import { CreatePage } from '../CreatePage';
import { PageItem } from './PageItem';

const PAGE_SIZE = 10;

interface Props {
  isTemplate?: boolean;
}

export function PageList({ isTemplate = false }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState('');
  const [biz, setBiz] = useState<Maybe<BizRecord['id']>>(null);
  const [pages, setPages] = useState<Maybe<PageRecordWithHistory[]>>(null);
  const [[current, total], setPagination] = useState([0, 1]);
  const [createVisible, setCreateVisible] = useState(false);

  const setBizWithResetPagination = useCallback((biz: Maybe<BizRecord['id']>) => {
    setBiz(biz);
    setPagination([0, 0]);
  }, []);

  const setTotal = useCallback((total: number) => {
    setPagination(([current]) => [current, total]);
  }, []);

  const setCurrentPage = useCallback((current: number) => {
    setPagination(([, total]) => [current, total]);
  }, []);

  useAsyncEffect(async () => {
    setLoading(true);
    const [success, pages, response] = await queryPages(biz, isTemplate || false, current, PAGE_SIZE, keywords.trim());
    setLoading(false);

    if (success) {
      const { data, total } = pages!;
      setPages(data);
      setTotal(total);
    } else {
      message.error(`${t('Failed to get pages list')}：${response.message}`);
    }
  }, [current, biz, keywords, isTemplate]);

  const onSetKeywords = useCallback((keywords: string) => {
    setCurrentPage(0);
    setKeywords(keywords);
  }, []);

  return (
    <Spin spinning={loading}>
      <Header
        title={t(isTemplate ? 'Template List' : 'Page List')}
        searchText={t(isTemplate ? 'Search template' : 'Search page')}
        onSearch={onSetKeywords}
        appendAfterSearch={
          <Button type="primary" size="large" icon={<BiPlus />} onClick={() => setCreateVisible(true)} />
        }
      />

      <BizSelector className="page-list-biz-selector" onSelect={setBizWithResetPagination} />

      {pages?.length ? (
        <div className="pages content card-items">
          {pages?.map(page => (
            <PageItem key={page.id} item={page} isTemplate={isTemplate} />
          ))}

          <FlexPlaceholder />

          <Pagination pageSize={PAGE_SIZE} current={current + 1} total={total} onChange={i => setCurrentPage(i - 1)} />
        </div>
      ) : (
        <Empty className="empty-content" description={t('No page data')} />
      )}

      <CreatePage visible={createVisible} setVisible={setCreateVisible} isTemplate={isTemplate} />
    </Spin>
  );
}
