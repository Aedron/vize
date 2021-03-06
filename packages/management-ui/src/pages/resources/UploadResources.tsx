import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Modal, PageHeader, Upload, message, Tag } from 'antd';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { BiArchiveOut } from 'react-icons/bi';
import { ResourceType } from 'types';
import { useTranslation, Trans } from 'react-i18next';

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  type: ResourceType;
}

const { Dragger } = Upload;

export function UploadResources({ visible, setVisible, type }: Props) {
  const { t } = useTranslation();
  const onBack = useCallback(() => setVisible(false), []);

  const uploadProps = useMemo(() => {
    return {
      name: 'file',
      withCredentials: true,
      multiple: true,
      action: '/cgi/resource/upload',
      onChange(info: UploadChangeParam) {
        const { status, name } = info.file;
        if (status === 'done') {
          message.destroy();
          return message.success(`"${name}" ${t('uploaded successfully')}`);
        } else if (status === 'error') {
          message.destroy();
          return message.error(`"${name}" ${t('failed to upload')}`);
        }
      },
    };
  }, [type]);

  return (
    <Modal
      className="upload-resources"
      title=""
      visible={visible}
      onCancel={onBack}
      footer={null}
      closeIcon={<span />}
      destroyOnClose
      closable
    >
      <PageHeader onBack={onBack} title={t('Upload Resources')} subTitle="" />
      <Dragger {...uploadProps}>
        <BiArchiveOut className="upload-drag-icon" />
        <h3>
          <Trans>Click or drag files here to upload</Trans>
        </h3>
        <div className="upload-hint">
          <p>
            <Trans>Support multiple files. Supported formats</Trans>:
          </p>
          <ul>
            <li>
              <span>
                <Trans>Images</Trans>:
              </span>
              <Tag color="orange">jp(e)g</Tag>
              <Tag color="orange">(a)png</Tag>
              <Tag color="orange">gif</Tag>
              <Tag color="orange">webp</Tag>
              <Trans>...</Trans>
            </li>
            <li>
              <span>
                <Trans>Videos</Trans>(H264):
              </span>
              <Tag color="orange">mp4</Tag>
              <Tag color="orange">m4v</Tag>
              <Trans>...</Trans>
            </li>
            <li>
              <span>
                <Trans>Audios</Trans>(AAC):
              </span>
              <Tag color="orange">mp3</Tag>
              <Tag color="orange">ogg</Tag>
              <Trans>...</Trans>
            </li>
            <li>
              <span>
                <Trans>Others</Trans>:
              </span>
              <Trans>Like text etc.</Trans>
            </li>
          </ul>
        </div>
      </Dragger>
    </Modal>
  );
}
