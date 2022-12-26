import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Modal, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * 权限列表
 * @returns 权限列表
 */
export default function DraftNews() {
  const [draftList, setDraftList] = useState([])
  const User = JSON.parse(localStorage.getItem("token"))
  const [updateOpen, setUpdateOpen] = useState(false)
  // 控制表单引用
  const DraftFormRef = useRef()
  const navigator = useNavigate()
  useEffect(()=>{
    axios.get(`/news?author=${User.username}&auditState=0&_expand=category`).then(res=>{
      const list = res.data
      // 防止children为空数组，页面还生成可展开按钮
      list.map(item=>{
        if(!item.children?.length>0){
          item.children = ""
        }
      })
      
      setDraftList(list)
    }).catch(err=>{
      console.log(err)
    })
  },[])

  // 确认删除方法
  const deleteMethod = (item)=>{
    // 更新前端数据
    setDraftList(draftList.filter(data=> data.id !== item.id))
    axios.delete(`/news/${item.id}`)
    message.success("删除新闻成功！")
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
      render: (id)=>{return <b>{id}</b>}
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item)=>{
        // 由于是超链接形式，所以记得带上#号
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
        // return <div onClick={()=>{navigator(`/news-manage/preview/${item.id}`)}} style={{color: "blue"}}>{title}</div>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category)=>{return category?.title}
    },
    {
      title: '操作',
      render: (item)=>{
        return (
          <div>
            <Button danger={true} shape="circle" icon={<DeleteOutlined />} onClick={()=>confirm(item)} />
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>handleAudit(item)} />
            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>{handleCheck(item.id)}} />
          </div>
        )
      }
    },
  ];


  const handleAudit = (item)=>{
    // console.log(item)
    navigator(`/news-manage/update/${item.id}`)

  }

  const handleCheck = (id)=>{
    axios.patch(`/news/${id}`, {auditState: 1}).then(res=>{
      message.success("提交审核成功！")
      // 跳转页面
      navigator('/audit-manage/list')
    }).catch(err=>{
      console.log(err)
    })
    
  }

  return (
    <div className='draftList'>
      <Table id='list-table' dataSource={draftList} columns={columns} rowKey={(item)=>item.id} pagination={{
        pageSize: 5,

      }} />
    </div>
  )
}
