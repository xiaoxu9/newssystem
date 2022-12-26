import axios from 'axios'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { Table, Button, Form, Input, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';
/**
 * 新闻分类
 * @returns 
 */

const EditableContext = React.createContext(null);

export default function CategoryNews() {

  const [dataSource, setDataSource] = useState([])

  useEffect(()=>{
    axios.get(`/categories`).then(res=>{
      setDataSource(res.data)
    })
  }, [])

  const handleDelete = (item)=>{
    setDataSource(dataSource.filter(data=> data.id !== item.id))
    try{
      axios.delete(`/categories/${item.id}`).then(res=>{
        message.success("删除成功!")
      })
    }catch{
      message.error("删除失败!")
    }
  }

  const handleSave = (record)=>{
    // console.log(record)
    setDataSource(dataSource.map(item=>{
      if(item.id === record.id){
        return {
          id: item.id,
          title: record.title,
          value: record.title,
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`, {
      id: record.id,
      title: record.title,
      value: record.title,
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id)=>{return <b>{id}</b>}
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave,
      }),
    },
    {
      title: '操作',
      render: (item)=>{
        return (
          <div>
            {
              <Button shape="circle" danger onClick={()=>handleDelete(item)} icon={<DeleteOutlined />} />
            }
          </div>
        )
      }
    },
  ];

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };


  return (
    <div className='dataSource'>
      <Table id='list-table' 
        dataSource={dataSource} 
        columns={columns} 
        pagination={{ pageSize: 5,}} 
        rowKey={(item)=>item.id} 
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
    </div>
  )
}
