import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import './right.css'

/**
 * 权限列表
 * @returns 权限列表
 */
export default function RightList() {
  const [rightList, setRightList] = useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      const list = res.data
      // 防止children为空数组，页面还生成可展开按钮
      list.map(item=>{
        if(!item.children?.length>0){
          item.children = ""
        }
      })
      
      setRightList(list)
    }).catch(err=>{
      console.log(err)
    })
  },[])

  // 确认删除方法
  const deleteMethod = (item)=>{
    console.log(item)
    // 要执行删除操作，得更新当前页面状态，并请求更新后端数据
    // 一级目录写法
    // // 更新前端状态
    // setRightList(rightList.filter(data => data.id !== item.id))
    // // 更新后端数据
    // axios.delete(`/rights/${item.id}`).catch(err=>{
    //   console.log(err)
    // })

    // 二级目录写法
    if(item.grade === 1){
      setRightList(rightList.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`).catch(err=>{
        message.error("删除权限失败！")
      })
      message.success("删除权限成功！")
    }else{
      // 深复制第一层，第二层只是浅复制，所以修改第二层children时，会影响到rightList
      const list = rightList.filter(data=> data.id === item.rightId)
      // 由于修改的是第二层的children，所以会影响到rightList
      list[0].children = list[0].children.filter(data=> data.id !== item.id)
      setRightList([...rightList])
      axios.delete(`/children/${item.id}`).catch(err=>{
        message.error("删除权限失败！")
      })
      message.success("删除权限成功！")
    }
  }

  // 取消删除方法
  const cancelMethod = (item)=>{
    message.success("取消删除!")
  }

  // 点击按钮弹出对话框方法
  const confirm = (item) => {
    Modal.confirm({
      title: '此操作危险！',
      icon: <ExclamationCircleOutlined />,
      content: '您确定真的要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: ()=>deleteMethod(item),
      onCancel: ()=>cancelMethod(item)
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id)=>{return <b>{id}</b>}
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key)=>{return <Tag color="purple">{key}</Tag>}
    },
    {
      title: '操作',
      key: "exit",
      render: (item)=>{
        return (
          <div>
            <Button danger={true} shape="circle" icon={<DeleteOutlined />} onClick={()=>confirm(item)} />
            <Popover content={<Switch checked={item.pagepermisson} onClick={()=>{
              const list = [...rightList]
              list.map(data=>{
                if(data.grade === 1){
                  // 一级目录
                  if (data.id === item.id){
                    // 不直接取反原因： 取反会导致pagepermisson的值改为undefined，从而导致编辑按钮trigger判断为undefined时，变为灰色
                    if (item.pagepermisson === 1) {
                      data.pagepermisson = 0
                      setRightList(list)
                      // 更新后端数据
                      axios.patch(`/rights/${item.id}`, {pagepermisson: data.pagepermisson})
                    }else if(item.pagepermisson === 0){
                      data.pagepermisson = 1
                      setRightList(list)
                      // 更新后端数据
                      axios.patch(`/rights/${item.id}`, {pagepermisson: data.pagepermisson})
                    }
                    console.log(data.pagepermisson)
                  }
                }else{
                  // 二级目录
                  data.children.map(data2=>{
                    if(data2.id === item.id){
                      if (item.pagepermisson === 1) {
                        data2.pagepermisson = 0
                        setRightList(list)
                        axios.patch(`/rights/${item.id}`, {pagepermisson: data.pagepermisson})
                      }else if(item.pagepermisson === 0){
                        data2.pagepermisson = 1
                        setRightList(list)
                        axios.patch(`/rights/${item.id}`, {pagepermisson: data.pagepermisson})
                      }
                      
                    }
                  })
                }
              })
              
            }} />} title="页面配置项" trigger={(item.pagepermisson === undefined) ? "" : "click"}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={(item.pagepermisson === undefined || item.pagepermisson === false)} />
            </Popover>
          </div>
        )
      }
    },
  ];


  return (
    <div className='rightlist'>
      <Table id='list-table' dataSource={rightList} columns={columns} pagination={{
        pageSize: 5,

      }} />
    </div>
  )
}
