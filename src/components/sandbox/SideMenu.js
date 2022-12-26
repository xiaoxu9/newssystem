import React, { useState,useEffect } from 'react';
import { Layout, Menu  } from 'antd';
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

const { Sider } = Layout;

const getItem = (
  label,
  key,
  icon,
  children,
  type,
) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


function SideMenu(props) {
    const [menu, setMenu] = useState([])
    // const [openKeys,setOpenKeys] = useState([])
    // const [selectedKeys, setSelectedKeys] = useState([])
    const openKeys = ["/" + useLocation().pathname.split("/")[1]]
    const location = useLocation().pathname
    const [theme, setTheme] = useState('dark');
    const navigate = useNavigate()

    useEffect(()=>{
      axios.get("/rights?_embed=children").then(res=>{
        // console.log(res.data)
        setMenu(res.data)
      }).catch(err=>{
        console.log(err)
      })
    },[])

    const {role} = JSON.parse(localStorage.getItem("token"))

    // 返回左侧导航单数据
    const renderMenu = (menuList)=>{
      const items = []
      menuList.map(item=>{
        // 一级父类筛选：处于可显示状态，并且权限列表中包含改权限都过滤出来
        if(item.pagepermisson === 1 && role.rights.includes(item.key)){
          // 先存放一级属性，再存放二级属性
          items.push(getItem(item.title, item.key, item.icon, (item.children?.length ? childList(item.children) : "")))
        }
      })
      // console.log(items)

      // 返回一个数组
      return items
    }


    // 存在孩子时，执行该回调函数
    const childList = (childs)=>{
      const child = []
      childs.map(item=>{
        // 二级孩子筛选：处于可显示状态，并且权限列表中包含改权限都过滤出来
        if(item.pagepermisson === 1 && role.rights.includes(item.key)){
          child.push(getItem(item.title, item.key, item.icon))
        }
      })

      // 返回一个数组
      return child
    }

    const onClick = (item)=>{
      // 记录选中的页面
      // setOpenKeys(item.key)
      // // 记录展开的页面选项菜单
      // setSelectedKeys("/" + item.key.split("/")[1])
      navigate(item.key)
    }


  return (
    <div className='side'>
      <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div style={{display: "flex", height: "100vh", "flexDirection": "column"}}>
          <div className="logo" >全球新闻发布管理系统</div>
          <div style={{flex: 1, "overflow": "auto"}}>
            <Menu
              defaultOpenKeys = {openKeys}
              defaultSelectedKeys = {location}
              theme={theme}
              mode="inline"
              items={renderMenu(menu)}
              onClick={onClick}
              />
          </div>
        </div>
      </Sider>
    </div>
  )
}

const mapStateToProps = ({CollapsedReducer: {isCollapsed}})=>{
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu)

