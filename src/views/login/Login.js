import React from 'react'
import './login.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()

  /**
   *  提交表单且数据验证成功后回调事件
   * @param {*} values 
   */
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
      if(res.data.length === 0){
        // 数据库不能存在该用户
        message.error("用户名或者密码不匹配!")
      }else{
        // 数据库存在该用户
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        // 重定向到主页面
        navigate("/")
      }
    })
  };

  // 用户名校验规则
  const usernameRoles = [
    { 
      required: true, 
      message: '请输入6-18个字符之间的密码!' 
    }
  ]

  // 密码校验规则
  const passwordRoles = [
    { 
      required: true, 
      message: '请输入6-18个字符之间的密码!' 
    }
  ]

  return (
    <div className='login'>
      <div className='form'>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <h1>全球新闻发布管理系统</h1>
          {/* 用户名输入框 */}
          <Form.Item name="username" rules={usernameRoles} >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          {/* 密码输入框 */}
          <Form.Item name="password" rules={passwordRoles} >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      
    </div>
  )
}
