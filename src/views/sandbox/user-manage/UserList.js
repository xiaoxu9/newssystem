import React, { useEffect, useRef, useState } from 'react'
import { Switch, Table, Modal, Button, message } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';

/**
 * 用户列表
 * @returns 用户列表
 */
export default function UserList() {
  const [addOpen, setAddOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roles, setRoles] = useState([])
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true)
  const [current, setCurrent] = useState("")

  // 用于透传引用到子组件
  const addForm = useRef(null)
  const updateForm = useRef(null)

  useEffect(()=>{
      axios.get("/regions").then(res=>{
          setRegionList(res.data)
      }).catch(err=>{
        console.log(err)
      })
  },[])

  useEffect(()=>{
      axios.get("/roles").then(res=>{
          setRoles(res.data)
      }).catch(err=>{
        console.log(err)
      })
  },[])

  const {roleId, username, region} = JSON.parse(localStorage.getItem("token"))

  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }

  useEffect(()=>{
    axios.get("/users?_expand=role").then(res=>{
      const list = res.data
      // setDataSource(res.data)
      // 如果是超级管理员，返回全部用户，如果是其它用户，那么只返回本身和级别比他小的区域编辑用户（区域编辑返回的孩子区域编辑）
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item=> item.username === username),
        ...list.filter(item=> item.region === region && roleObj[item.roleId] === "editor")
      ])
    }).catch(err=>{
      console.log(err)
    })
  },[])

  // 存放用户信息
  const [dataSource, setDataSource] = useState([])

  // 确认删除方法
  const deleteMethod = (item)=>{
    // 更新前端状态
    const list = [...dataSource]
    setDataSource( list.filter(data=> (data.id !== item.id)))

    // 更新后端
    axios.delete(`/users/${item.id}`).catch(err=>{
      message.error("删除用户失败！")
    })
    message.success("删除用户成功！")
    
  }

  const cancel = ()=>{
    message.success("取消删除！")
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
      onCancel: ()=>cancel()
    });
  };

  const updateState = (item)=>{
    setUpdateOpen(true)
    // 保存当前id
    setCurrent(item.id)
    // 判断是否为超级管理员，如果是，通过更新isUpdateDisabled 并且以父传子形式间接更新子组件，从而控制 区域 是否为可选的状态
    if(item.id === 1){
      // 禁用
      setIsUpdateDisabled(true)
    }else{
      // 解除禁用
      setIsUpdateDisabled(false)
    }
  }

  /**
   *  弹出更新用户表单,  使用async await解决热更新问题
   */
  const updateHandle = async (item)=>{
    await updateState(item)
    // 填充数据
    updateForm.current.setFieldsValue(item)
    
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      // 遍历显示筛选字段
      filter: [
        regionList.map(item=>({
          text: item.title,
          value: item.region
        }))
      ],
      // 筛选字段条件
      onFilter:(value, item)=>{
          if(value === "全球"){
            return item.region === ""
          }else{
            return item.region === value
          }
      },
      render: (region)=>{return <b>{(region === "" ? "全球" : region)}</b>}
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role)=>{
        return role?.roleName
      }
    },
    
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item)=>{return <Switch checked={roleState} disabled={item.default} onClick={()=>{
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        // 更新后端数据
        axios.patch(`/users/${item.id}`, {roleState: item.roleState}).catch(err=>{
          console.log(err)
        });
        message.success("修改用户状态成功！")
      }}/>}
    },
    {
      title: '操作',
      key: "exit",
      render: (item)=>{
        return (
          <div>
            <Button danger={true} shape="circle" icon={<DeleteOutlined />} onClick={()=>confirm(item)}  disabled={item.default} />
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={()=>{
              updateHandle(item)
            }}  disabled={item.default} />
          </div>
        )
      }
    },
  ]

  /**
   *  点击确认添加用户时执行
   */
  const addFormOK = ()=>{
    addForm.current.validateFields().then(value=>{
      // 校验规则通过
      // 关闭表单页面
      setAddOpen(false)
      // post到后端，才会生成id，再设置前端状态dataSource，方便后面的删除和更新，如果先更新前端状态，会导致更新的状态丢失id
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res=>{
        // 后端返回id，更新前端  由于role不会自动关联，所以得自己加上去
        setDataSource([...dataSource, {...res.data, role: roles.filter(item=>item.id === res.data.roleId)[0] }])
      }).catch(err=>{
        message.err("添加用户失败！")
      })
      message.success("添加用户成功!")
    }).catch(err=>{
      // 校验规则失败
      message.err("添加用户失败，请检查填写信息是否正确!")
    })
  }

  /**
   *  点击确认更新用户时执行
   */
  const updateFormOK = ()=>{
    updateForm.current.validateFields().then(value=>{
      // 校验规则通过
      // 关闭表单页面
      setUpdateOpen(false)
      // 更新前端
      setDataSource(dataSource.map(item=>{
          if(item.id === current){
            return {
              ...item,
              ...value,
              role: roles.filter(data=>data.id === value.roleId)[0]
            }
          }
          return item
      }))
      axios.patch(`/users/${current}`, value).catch(err=>{
        message.err("更新用户失败！")
      })
      message.success("更新用户成功!")
    }).catch(err=>{
      // 校验规则失败
      message.err("更新用户失败，请检查填写信息是否正确!")
    })
  }

  return (
    <div>
      <Button type="primary" style={{margin: "20px"}} onClick={()=>{
        setAddOpen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} pagination={{
        pageSize: 6
      }} />

      {/* 添加用户表单 */}
      <Modal
        open={addOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setAddOpen(false)
          message.success("取消添加用户!")
        }}
        onOk={() => {addFormOK()}}
      >
        <UserForm regionList={regionList} roles={roles} ref={addForm} />
      </Modal>

        {/* 更新用户表单 */}
      <Modal
        open={updateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={()=>{
          setUpdateOpen(false)
          message.success("取消更新用户!")
          // 更新区域状态，解决设置为超级管理员时，下一次打开页面，区域变为不可选
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => { updateFormOK() }}
      >
        <UserForm regionList={regionList} roles={roles} ref={updateForm} isUpdateDisabled={isUpdateDisabled} />
      </Modal>
      
    </div>
  )
}
