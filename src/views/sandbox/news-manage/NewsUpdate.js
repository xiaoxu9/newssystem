import React, { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import { Button, Steps, Form, Input, Select, message, notification } from 'antd';
import style from './css/addnews.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

export default function NewsUpdate() {
  useEffect(()=>{
    axios.get(`/categories`).then(res=>{
      setCategoryList(res.data)
    })

    axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
      setContent(res.content)
      ref.current?.setFieldsValue({
        title: res.data.title,
        category: res.data.categoryId
      })
    })
  },[])

  // 控制步骤条处于第几步
  const [current, setCurrent] = useState(0)
  // 保存新闻类别集合
  const [categoryList, setCategoryList] = useState([])
  // 保存第一步填写的表单信息
  const [formInfo, setFormInfo] = useState([])
  // 保存新闻内容
  const [content, setContent] = useState([])

  // 当前用户信息
  const User = JSON.parse(localStorage.getItem("token"))

  const [form] = Form.useForm();

  const navigator = useNavigate();
  const ref = useRef();
  const {id} = useParams()

  // 下一步
  const handleNext = ()=>{
    if(current === 0){
      // 校验表单数据，如果没问题，放行
      ref.current?.validateFields().then(res=>{
        // console.log(res)
        setFormInfo(res)
        setCurrent( current + 1 )
      }).catch(err=>{
        console.log(err)
      })
    }else{
      // 校验新闻内容
      // content.trim() === "<p></p>" 点击输入内容后并删除为空会出现该情况
      if(content === "" || content === "<p><br/></p>"){
        message.error("新闻内容不能为空!")
      }else{
        setCurrent( current + 1 )
      }
    }
  }

  // 新闻标题校验规则
  const newsTitleRoles = [
    { 
      required: true,
      min: 3,
      max: 30,
      message: "新闻标题得在3-30个字符之间！" 
    }
  ]

  // 新闻分类校验规则
  const newsCategoryRoles = [
    { 
      required: true,
      message: "请选择一个新闻类别！" 
    }
  ]

  // 保存草稿箱
  const handleSave = (auditState)=>{
    axios.popatchst(`/news/${id}`, {
      ...formInfo,  // 标题和新闻类别
      "content": content,  // 新闻内容
      "auditState": auditState,  // 保存草稿箱为0，提交审核为1
    }).then(res=>{
      // 保存成功，跳转页面  （0：草稿箱， 1：审核列表）
      navigator(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
      //openNotification(auditState)
    }).catch(err=>{
      console.log(err)
      message.error("保存到草稿箱失败！")
    })
  }

  const [api] = notification.useNotification();
  // 提示框
  const openNotification = (auditState) => {
    api.info({
      message: "通知",
      description: `您可以到${auditState}查看您的新闻!`,
      placement: "bottomRight",
    });
  };

  return (
    <div style={{height: "86vh"}}>
      {/* 页头 */}
      <PageHeader title="更新新闻" />

      {/* 步骤条 */}
      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类',
          },
          {
            title: '新闻内容',
            description: '新闻主题内容',
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核',
          },
        ]}
      />

      {/* 使用隐藏而不用短路与，是因为短路与当状态发生改变时，由于条件不满足，后面的不会执行，也就是保存不了
      再次条件满足时会重新渲染，导致无法保存之前输入的信息 */}
      <div className={current === 0 ? "" : style.active} style={{marginTop: "50px"}}>
        <Form {...layout} form={form} name="control-hooks" ref={ref}>
          <Form.Item name="title" label="新闻标题" rules={newsTitleRoles}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="新闻分类" rules={newsCategoryRoles}>
            <Select
              placeholder="请选择新闻类别">
              {
                categoryList.map(item=>
                <Option value={item.id} key={item.id}>{item.title}</Option>)
              }
            </Select>
          </Form.Item>
        </Form>
      </div>

      {/* 步骤条第二步展示页面： 富文本编辑器 */}
      <div className={current === 1 ? "" : style.active} style={{marginTop: "50px", height: "780px", overflow: "auto"}}>
        <NewsEditor getContent = {(value)=>{ setContent(value) }} content = {content}/>
      </div>

      {/* 底部按钮 */}
      <div style={{marginTop: "50px"}}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={ ()=>handleSave(0) }>保存草稿箱</Button>
            <Button danger onClick={ ()=>handleSave(1) }>提交审核</Button>
          </span>
        }
        { current < 2 && <Button type="primary" ghost onClick={ handleNext }>下一步</Button>}
        { current > 0 && <Button type="primary" ghost onClick={()=>{ setCurrent( current - 1) }}>上一步</Button>}
      </div>

    </div>
  )
}
