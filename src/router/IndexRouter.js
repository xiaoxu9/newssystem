import { HashRouter, Route, Routes } from 'react-router-dom'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import NotFound from '../views/404';
import NotPermission from '../views/NotPermission';
import Home from '../views/sandbox/home/Home';
import RightList from '../views/sandbox/right-manage/RightList';
import RoleList from '../views/sandbox/right-manage/RoleList';
import UserList from '../views/sandbox/user-manage/UserList';
import AddNews from '../views/sandbox/news-manage/AddNews';
import DraftNews from '../views/sandbox/news-manage/DraftNews';
import CategoryNews from '../views/sandbox/news-manage/CategoryNews';
import NewsPreview from '../views/sandbox/news-manage/NewsPreview';
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate';
import AuditNews from '../views/sandbox/audit-manage/AuditNews';
import AuditList from '../views/sandbox/audit-manage/AuditList';
import Unpublished from '../views/sandbox/publish-manage/Unpublished';
import Published from '../views/sandbox/publish-manage/Published';
import Sunset from '../views/sandbox/publish-manage/Sunset';
import Login from '../views/login/Login'
import Redirect from '../components/Redirect';
import AuthComponent from '../components/AuthComponent';
import NewsSandBox from '../views/sandbox/NewsSandBox';
import News from '../news/News';
import Detail from '../news/Detail';

export default function IndexRouter() {

    // 存放当前系统拥有的全部权限
    const [BackRouteList, setBackRouteList] = useState([])

    useEffect(()=>{
        Promise.all([
            axios.get(`/rights`),
            axios.get(`/children`),
        ]).then(res=>{
            setBackRouteList([...res[0].data, ...res[1].data])
        })   
    }, [])

    // 系统拥有的所有权限枚举
    const LocalRouterMap = {
        "/home": <Home />,
        // 用户管理
        "/user-manage/list": <UserList />,
        // 权限管理
        "/right-manage/role/list": <RoleList />,
        "/right-manage/right/list": <RightList />,
        // 新闻管理
        "/news-manage/add": <AddNews />,
        "/news-manage/draft": <DraftNews />,
        "/news-manage/category": <CategoryNews />,
        "/news-manage/preview/:id": <NewsPreview />,
        "/news-manage/update/:id": <NewsUpdate />,
        // 审核管理
        "/audit-manage/audit": <AuditNews />,
        "/audit-manage/list": <AuditList />,
        // 发布管理
        "/publish-manage/unpublished": <Unpublished />,
        "/publish-manage/published": <Published />,
        "/publish-manage/sunset": <Sunset />,
    };

    // 当前用户拥有的全部信息
    const userInfo = JSON.parse(localStorage.getItem("token"))

    // 遍历当前用户所有处于打开状态的页面权限，并且后端存在该路由  控制页面侧边栏展示：pagepermisson  新闻预览（不在侧边栏展示）：routepermisson
    const pageIsShowAboutAll = (item)=>{
      return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson )
    }

    // 遍历当前用户是否具备打开某个页面的权限
    const pageIsShowAboutUser = (item)=>{
      return userInfo.role.rights.includes(item.key)
    }


  return (
    <HashRouter>
      <Routes>
        
          <Route path='/login' element={<Login />}/>
          {/* 游客系统访问页面 */}
          <Route path='/news' element={<News />} />
          {/* 游客系统查看新闻详情页面 */}
          <Route path='/detail/:id' element={<Detail />} exact />
          {/* 校验权限 */}
          <Route path='/' element={<AuthComponent> <NewsSandBox /> </AuthComponent>} >
            <Route path='' element={<Home />} />
              {
                BackRouteList.map(item=>{
                    // 遍历校验符合条件的路由  拥有页面权限和拥有页面权限是否关闭
                    if( pageIsShowAboutAll(item) && pageIsShowAboutUser(item) ){
                        return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} />
                    }
                    return null;
                })
              }
          </Route>

          {/* 重定向到首页 */}
          <Route path='/' element={<Redirect to="/home" />} />

          {/* 错误页面  */}
          {BackRouteList.length > 0 && <Route path='*' element={<NotFound />} />}
      </Routes>
    </HashRouter>
  )
}

