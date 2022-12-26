import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, theme, Dropdown, Avatar} from 'antd';
import { connect } from 'react-redux';
const { Header } = Layout;

function TopHeader(props) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const {role, username} = JSON.parse(localStorage.getItem("token"))

    // console.log(props)
    const items = [
    {
        key: '1',
        label: (
            role.roleName
        ),
    },
    {
        key: '2',
        danger: true,
        label: '退出登录',
        onClick: ()=>{ onClickHandle() },
    },
    ];

    const onClickHandle = ()=>{
        // 删除本地的item
        localStorage.removeItem("token")
        // 重定向到登录页面
        navigate("/login")
    }

    const navigate = useNavigate()

    const changeCollapsed = ()=>{
        props.changeCollapsed()
    }

  return (
    <Header
        style={{
            padding: 0,
            background: colorBgContainer,
        }}
    >
        {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: ()=>{changeCollapsed()},
        })}

        <div style={{float: "right", padding: "20px", paddingTop: "0px", paddingRight: "50px", fontSize: "18px", color: "green"}}>
            {username}
            <div style={{marginLeft: "20px", float: "right"}}>
                <Dropdown
                    menu={{
                        items,
                    }}
                    autoFocus={true}
                >
                    <Avatar id='imgHead' size="large" icon={<UserOutlined />}  />
                </Dropdown>
            </div>
           
        </div>
  </Header>
  )
}

const mapStateToProps = ({CollapsedReducer: {isCollapsed}})=>{
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type: "change-collapsed",
            // payload:
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)