import React, { forwardRef, useEffect, useState } from 'react'
import { message, Form, Select, Input } from 'antd'

const UserForm = forwardRef((props, ref)=> {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(()=>{
      setIsDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])

    // 校验规则
    const nameRoles = [
        {
            required: true,
            min: 3,
            max: 12,
            message: '请输入3-12个字符之间的用户名!',
        },
    ]

    const passwordRoles = [
        {
            required: true,
            min: 6,
            max: 18,
            message: "请输入6-18个字符之间的密码!",
        }
    ]

    const regionRoles = isDisabled ? [] : [
        {
            required: true,
            message: "请选择一个区域!",
        }
    ]

    const rolesFrom = [
        {
            required: true,
            message: "请选择一个角色!",
        }
    ]
    
    const {roleId, region} = JSON.parse(localStorage.getItem("token"))

  return (
    <div>
        <Form
          form={form}
          ref={ref}
          layout="vertical"
        >
            {/* name为生成表的字段名 */}
          <Form.Item name="username" label="用户名" rules={nameRoles}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={passwordRoles}>
            <Input.Password type="password" />
          </Form.Item>
          <Form.Item name="region" label="区域" rules={regionRoles}>
            <Select placeholder="请选择区域" disabled={isDisabled} >
              {props.regionList.map(item=>{
                // disabled={roleId === 1 ? false : true} 根据登录用户权限，选择性控制是否可编辑区域选项
                return <Option key={item.id} value={item.value} disabled={roleId === 1 ? false : true}>{item.title}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item name="roleId" label="角色" roles={rolesFrom}>
            <Select placeholder="请选择角色" onChange={(value)=>{
                if(value === 1){
                    // 表示为超级管理员，区域为全球，所以关闭 区域选择输入框
                    setIsDisabled(true)
                    ref.current.setFieldsValue({  // 设置表单选择框region为空
                        region: "",
                    })
                }else{
                    // 显示 区域选择输入框
                    setIsDisabled(false)
                }

            }} >
              {props.roles.map(item=>{
                // 登录用户如果是超级管理员，用户选项都可编辑，如果不是超级管理员，除了可更改为编辑，其它都不可编辑
                return <Option  key={item.id} value={item.id} disabled={roleId === 1 ? false : (item.id === 3 ? false : true)} >{item.roleName}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>
    </div>
  )
})

export default UserForm
