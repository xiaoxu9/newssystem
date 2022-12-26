import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom';

/**
 * 审核列表
 * @returns 审核列表
 */
export default function AuditList() {
  const [auditList, setAuditList] = useState([])
  const auditArr = ['未审核', '审核中', '已通过', '未通过'];
  const colorArr = ['gray', 'orange', 'green', 'red'];
  const navigator = useNavigate();
  const User = JSON.parse(localStorage.getItem('token'));
  useEffect(()=>{
    // 查询作者是自己，并且审核状态不等于(_ne)0  并且发布状态小于等于(_lte)1 连表分类信息
    axios.get(`/news?author=${User.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      // console.log(res.data)
      setAuditList(res.data)
    })
  }, [])

  // 撤销方法（已发布）
  const handleRevert = (item)=>{
    // console.log(item.id)
    try{
      setAuditList(auditList.filter(data=> (data.id !== item.id) ))
      axios.patch(`/news/${item.id}`, {auditState: 0})
      message.success("撤销新闻成功!")
    }catch{
      message.success("撤销新闻失败!")
    }
  }

  // 发布方法（已通过）
  const handlePublish = (item)=>{
    try{
      setAuditList(auditList.filter(data=> (data.id !== item.id) ))
      axios.patch(`/news/${item.id}`, {publishState: 2, publishTime: Date.now()}).then(res=>{
        message.success("发布新闻成功!")
      })
      // 跳转到已发布页面中
      navigator('/publish-manage/published')
    }catch{
      message.success("发布新闻失败!")
    }
  }

  // 更新方法（未通过）
  const handleUpdate = (item)=>{
    navigator(`/news-manage/update/${item.id}`)
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title)=>{return <b>{title}</b>}
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category)=>{return <div key={category.id}>{category.title}</div>}
    },
    {
      title: '新闻状态',
      dataIndex: 'auditState',
      render: (auditState)=>{return <Tag color={colorArr[auditState]}>{auditArr[auditState]}</Tag>}
    },
    {
      title: '操作',
      render: (item)=>{
        return (
          <div>
            {
              item.auditState === 1 && <Button onClick={()=>handleRevert(item)}>撤销</Button>
            }
            {
              item.auditState === 2 && <Button danger onClick={()=>handlePublish(item)}>发布</Button>
            }
            {
              item.auditState === 3 && <Button type='primary' onClick={()=>handleUpdate(item)}>更新</Button>
            }
          </div>
        )
      }
    },
  ];


  return (
    <div className='auditList'>
      <Table id='list-table' dataSource={auditList} columns={columns} pagination={{ pageSize: 5,}} rowKey={(item)=>item.id} />
    </div>
  )
}
