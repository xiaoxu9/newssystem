import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Tag, Modal, Button, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import './right.css'

/**
 * 角色列表
 * @returns 角色列表
 */
export default function RoleList() {

  useEffect(()=>{
    axios.get("/roles").then(res=>{
      setDataSource(res.data)
    }).catch(err=>{
      console.log(err)
    })
  },[])

  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      setRightList(res.data)
    }).catch(err=>{
      console.log(err)
    })
  },[])


  // 存放权限路径
  const [dataSource, setDataSource] = useState([])
  // 存放全部权限
  const [rightList, setRightList] = useState([])
  // 存放当前拥有的全部权限
  const [currentRight, setCurrentRight] = useState([])
  // 存放当前所操作用户的id值
  const [currentId, setCurrentId] = useState([])
  // 控制编辑按钮是否显示
  const [isModalOpen, setIsModalOpen] = useState(false)


  // 确认删除方法
  const deleteMethod = (item)=>{
   
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/reles/${item.id}`).catch(err=>{
        console.log(err)
      })
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
      onCancel: ()=>{}
    });
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      render: (id)=>{return <b>{id}</b>}
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },{
      title: '操作',
      key: "exit",
      render: (item)=>{
        return (
          <div>
            <Button danger={true} shape="circle" icon={<DeleteOutlined />} onClick={()=>confirm(item)} />
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={()=>{
              setIsModalOpen(true)
              setCurrentRight(item.rights)
              setCurrentId(item.id)
            }} />
          </div>
        )
      }
    },
  ]

  // 点击Ok时执行
  const handleOk = ()=>{
    // 关闭编辑权限页面
    setIsModalOpen(false)
    // 设置当前编辑好的权限回个人权限列表中
    setDataSource(dataSource.map(item=>{
      // 遍历所有roles用户，当id值和当前操作用户currentId时，更新用户修改后的权限
      if(item.id === currentId){
        return {
          ...item,
          rights: currentRight
        }
      }
      return item
    }))
    // 更新后端
    axios.patch(`/roles/${currentId}`, {rights: currentRight})
  }

  // 点击Cancel时执行
  const handleCancel = ()=>{
    setIsModalOpen(false)
  }

  // 点击复选框时执行
  const onCheck = (checkedKeys)=>{
    setCurrentRight(checkedKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        checkedKeys={currentRight}
        onCheck={onCheck}
        treeData={rightList}
        checkStrictly = {true}
      />
      </Modal>
    </div>
  )
}
