import React, { forwardRef, useEffect, useState } from 'react'
import { message, Form, Select, Input } from 'antd'
import axios from 'axios';

const DraftForm = forwardRef((props, ref)=> {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [categoryList, setCategoryList] = useState([])

    useEffect(()=>{
        axios.get(`/categories`).then(res=>{
          setCategoryList(res.data)
        })
      },[])

    // 校验规则
    const titleRoles = [
        {
            required: true,
            min: 3,
            max: 30,
            message: '请输入3-30个字符之间的用户名!',
        },
    ]

    const authorRoles = [
        {
            required: true,
            min: 6,
            max: 18,
            message: "请输入6-18个字符之间的密码!",
        }
    ]

    const categoryRoles = [
        {
            required: true,
            message: "请选择一个区域!",
        }
    ]
    
    const User = JSON.parse(localStorage.getItem("token"))

  return (
    <div>
        <Form
          form={form}
          ref={ref}
          layout="vertical"
        >
            {/* name为生成表的字段名 */}
          <Form.Item name="title" label="新闻标题" rules={titleRoles}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="作者" rules={authorRoles}>
            <Input placeholder={User.username} disabled={true} />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={categoryRoles}>
            <Select placeholder="请选择新闻类别!" >
              {categoryList.map(item=>{
                // disabled={roleId === 1 ? false : true} 根据登录用户权限，选择性控制是否可编辑区域选项
                return <Option key={item.id} value={item.id} >{item.title}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>
    </div>
  )
})

export default DraftForm
