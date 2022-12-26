import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List, Avatar } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'

/**
 * 首页
 * @returns 首页
 */

const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
  
  // 访问量最多的六条数据
  useEffect(()=>{
    // 获取处于发布状态，按倒序排列的数据 并且最多只要6条
    axios.get(`/news?publishState=2&_expand=category&_sort=view_order=desc&_limit=6`).then(res=>{
      // console.log(res.data)
      setViewList(res.data)
    })
  }, [])

  // 点赞量最多的六条数据
  useEffect(()=>{
    // 获取处于发布状态，按倒序排列的数据 并且最多只要6条
    axios.get(`/news?publishState=2&_expand=category&_sort=star_order=desc&_limit=6`).then(res=>{
      // console.log(res.data)
      setStarList(res.data)
    })
  }, [])

  const navigator = useNavigate()

  return (
    <div style={{height: "80vh", overflow: "auto"}}>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="large"
              // bordered
              dataSource={viewList}
              renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞量最多" bordered={true}>
            <List
              size="large"
              // bordered
              dataSource={starList}
              renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={true}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={<div>
                    <b>{region === "" ? "全球" : region}</b>
                    <span style={{paddingLeft: "30px"}}>{roleName}</span>
                  </div>}
              />
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
