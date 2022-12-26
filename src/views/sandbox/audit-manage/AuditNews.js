import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom';

/**
 * 审核新闻
 * @returns 审核新闻
 */
export default function AuditNews() {
  const [dataSource, setDataSource] = useState([])
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));

  useEffect(()=>{
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor",
    }

    axios.get(`/news?auditState=1&_expand=category`).then(res=>{
      setDataSource(roleObj[roleId] === "superadmin" ? res.data : [
        ...res.data.filter(item=> item.author === username),  // 过滤区域管理员自身
        ...res.data.filter(item=> item.region === region && roleObj[item.roleId] === 'editor'),  // 过滤该区域的区域编辑
      ])
    })
  }, [])

  const navigator = useNavigate();

  // 操作方法
  const handleAudit = (item, auditState, publishState)=>{
    // 过滤并移除要操作的数据
    setDataSource(dataSource.filter(data=> data.id !== item.id))
    try{
      axios.patch(`/news/${item.id}`, {auditState: auditState, publishState: publishState}).then(res=>{
      message.success(auditState === 2 ? "通过成功!" : "驳回成功！")
      })
    }catch{
      message.success(auditState === 2 ? "通过失败!" : "驳回失败！")
    }
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
      title: '操作',
      render: (item)=>{
        return (
          <div>
            {
              <Button type='primary' onClick={()=>handleAudit(item, 2, 1)}>通过</Button>
            }
            {
              <Button danger onClick={()=>handleAudit(item, 3, 0)}>驳回</Button>
            }
          </div>
        )
      }
    },
  ];


  return (
    <div className='dataSource'>
      <Table id='list-table' dataSource={dataSource} columns={columns} pagination={{ pageSize: 5,}} rowKey={(item)=>item.id} />
    </div>
  )
}
