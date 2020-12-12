import * as React from 'react';
import { Form, Button, Input, Select } from 'antd';
import { bizStore } from 'state';
import { ItemProps, PageDetail } from './types';
import { observer } from 'mobx-react';
import { useMemo, useState } from 'react';

const { Item: FormItem } = Form;
const { Option: SelectOption } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 5 },
};

function IPageDetailForm({ current, setCurrent }: ItemProps<Partial<PageDetail>>) {
  const { bizList } = bizStore;

  const [{ biz }, setValue] = useState(current);
  const currentBiz = useMemo(() => bizList?.find(i => i.id === biz), [bizList, biz]);

  console.log(biz, currentBiz);

  return (
    <Form
      {...layout}
      initialValues={current}
      className="page-detail-form"
      onFinish={setCurrent}
      onValuesChange={setValue}
    >
      <FormItem label="业务" name="biz" hasFeedback rules={[{ required: true, message: '请选择业务' }]}>
        <Select loading={!bizList}>
          {bizList?.map(({ id, name }) => (
            <SelectOption value={id} key={id}>
              {name}
            </SelectOption>
          ))}
        </Select>
      </FormItem>

      <FormItem label="页面地址" className="page-detail-key" required hasFeedback>
        <span>https://vize.com/{currentBiz?.key || 'bizKey'}/</span>
        <FormItem name="key" rules={[{ required: true, message: '请输入页面 key' }]}>
          <Input />
        </FormItem>
        <span>/index.html</span>
      </FormItem>

      <FormItem label="页面标题" name="title" rules={[{ required: true, message: '请输入标题' }]} hasFeedback>
        <Input />
      </FormItem>

      <FormItem label="页面描述" name="desc">
        <TextArea />
      </FormItem>

      {/*<Form.Item label="上下线时间">*/}
      {/*  <Form.Item*/}
      {/*    validateStatus="error"*/}
      {/*    help="上线时间"*/}
      {/*    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}*/}
      {/*  >*/}
      {/*    <DatePicker />*/}
      {/*  </Form.Item>*/}

      {/*  <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>-</span>*/}

      {/*  <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} help="下线时间">*/}
      {/*    <DatePicker />*/}
      {/*  </Form.Item>*/}
      {/*</Form.Item>*/}

      <FormItem>
        <Button type="primary" htmlType="submit">
          创建
        </Button>
      </FormItem>
    </Form>
  );
}

export const PageDetailForm = observer(IPageDetailForm);