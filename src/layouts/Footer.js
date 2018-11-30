import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Pro 首页',
          title: 'Pro 首页',
          href: 'javascript:void(0)',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'javascript:void(0)',
          blankTarget: true,
        },
        {
          key: 'DT Design',
          title: 'DT Design',
          href: 'javascript:void(0)',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 江苏盾泰体验技术部出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
