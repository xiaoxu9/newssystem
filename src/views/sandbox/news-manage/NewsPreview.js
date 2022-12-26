import React, { useEffect, useState } from 'react'
import { Descriptions, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'

/**
 * 新闻预览页面
 * @returns 
 */
export default function NewsPreview() {
  const { id } = useParams();
  const [detail, setDetail] = useState([]);
  const auditArr = ['未审核', '审核中', '已通过', '未通过'];
  const publishArr = ['未发布', '待发布', '已发布', '已下载'];
  const colorsArr = ['red', 'orange', 'blue', 'green']

  useEffect(()=>{
    axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
      setDetail(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }, [id])


  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={detail.title}
        subTitle={detail.category?.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{detail.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
          <Descriptions.Item label="发布时间">{ (detail.publishTime < 1 ? "-" : moment(detail.publishTime).format('YYYY-MM-DD HH:mm:ss')) }</Descriptions.Item>
          <Descriptions.Item label="区域">{detail.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <Tag color={colorsArr[detail.publishState]}>{auditArr[detail.auditState]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            <Tag color={colorsArr[detail.publishState]}>{publishArr[detail.publishState]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量"><span style={{color: colorsArr[2]}}>{detail.view}</span></Descriptions.Item>
          <Descriptions.Item label="点赞数量"><span style={{color: colorsArr[2]}}>{detail.star}</span></Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div style={{marginTop: "50px", fontSize: "25px", textAlign: "center"}}>新闻内容</div>
        <div dangerouslySetInnerHTML={{__html: detail.content}} style={{
          marginTop: "10px", 
          width: "100%", 
          border: "1px solid black", 
          textAlign: "left", 
          height: "60vh", 
          overflow: "auto"
          }} />
    </div>
  )
}
