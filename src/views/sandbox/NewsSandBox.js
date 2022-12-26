import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewSandBox.css'
import 'nprogress/nprogress.css'; 

import React from 'react';
import { Layout, theme, Spin } from 'antd';
import { connect } from 'react-redux';
const { Content } = Layout;

function NewsSandBox(props) {
  // 渲染打开进度条
  // NProgress.start()

  // useEffect(()=>{
  //   NProgress.done()
  // })

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout">
            <TopHeader></TopHeader>
            <Spin size="large" spinning={props.isLoading} >
              <Content style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                  overflow: "auto",
                  background: colorBgContainer,
              }}>
                  <Outlet />
              </Content>
            </Spin>
        </Layout>

      
    </Layout>
  )
}

const mapStateToProps = ({LoadingReducer: {isLoading}})=>{
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(NewsSandBox)
