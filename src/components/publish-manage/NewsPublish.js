import React from 'react'
import { Button, Table } from 'antd'

/**
 * 提取发布管理的公共组件
 * @param {*} props 
 * @returns 
 */
export default function NewsPublish(props) {

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item)=>{return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>}
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
            {props.button(item.id)}
          </div>
        )
      }
    },
  ];


  return (
    <div className='dataSource'>
      <Table id='list-table' dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5,}} rowKey={(item)=>item.id} />
    </div>
  )
}
