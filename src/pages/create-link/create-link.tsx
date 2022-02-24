import React, { FC, useCallback, useState } from 'react';

import { Button } from '@/components/button/button';
import { Form, Input, Radio } from 'antd';

import './create-link.scss';
import { TokenAutoComplete } from '@/components/token-auto-complete/token-auto-complete';

const PLACEHOLDERS: any = {
  http: {
    title: 'Green Knight secret resource',
    link: 'https://greenknight.com/secret',
  },
  telegram: {
    title: 'Green Knight secret telegram',
    link: 'https://t.me/GreenKnight_secret',
  },
};

export const CreateLinkPage: FC = () => {
  const [form] = Form.useForm();
  const [linkType, setLinkType] = useState('http');

  const onFormChange = useCallback(
    ({ type }: { type: any }) => {
      if (type) {
        setLinkType(type);
      }
    },
    [setLinkType]
  );

  const trySubmitForm = useCallback(() => {
    form.submit();
  }, [form]);

  const handleSubmit = (data: any) => {
    console.log('submit', data);
  };
  const selectToken = (token: any) => {
    console.log('selectToken', token);
  };

  const initialValues = { type: 'http' };

  return (
    <div className="create-link">
      <h2 className="create-link__title">Create secure link to resource to grant access for you loyal audience</h2>

      <div className="create-link__form">
        <Form
          layout="horizontal"
          labelCol={{ span: 7 }}
          form={form}
          initialValues={initialValues}
          onValuesChange={onFormChange}
          onFinish={handleSubmit}
          requiredMark={false}
          size="large"
        >
          <Form.Item name="title" label="Title" tooltip="Title that users will see when authorizing" required>
            <Input placeholder={PLACEHOLDERS[linkType].title} />
          </Form.Item>

          <Form.Item name="token" label="Token" tooltip="Name, symbol or contract address of FA1.2 or FA2 token">
            <TokenAutoComplete onSelect={selectToken} />
          </Form.Item>

          <Form.Item
            label="Min balance"
            name="minBalance"
            tooltip="Minimal balance of tokens, if not specified then any quantity will be sufficient"
          >
            <Input placeholder="any" />
          </Form.Item>

          <Form.Item label="Link type" name="type">
            <Radio.Group value={linkType}>
              <Radio.Button value="http">HTTP</Radio.Button>
              <Radio.Button value="telegram">Telegram</Radio.Button>
              <Radio.Button value="discord" disabled>
                Discord
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="link" label="Link" tooltip="Link to resource, which you want to protect" required>
            <Input placeholder={PLACEHOLDERS[linkType].link} />
          </Form.Item>

          <Form.Item className="create-link__submit">
            <Button type="primary" onClick={trySubmitForm}>
              Create secure link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
