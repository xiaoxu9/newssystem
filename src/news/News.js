import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import _ from 'lodash'
import { Row, Col, Card, List } from 'antd'

export default function News() {
    const [dataSource, setDataSource] = useState([])
    useEffect(()=>{
        axios.get(`/news?publishState=2&_expand=category`).then(res=>{
            // _.groupBy 按item.category.title来分组， Object.entries 转换为二维数组
            console.log(Object.entries(_.groupBy(res.data, item=>item.category.title)))
            setDataSource(Object.entries(_.groupBy(res.data, item=>item.category.title)))
        })
    }, [])
  return (
    <div>
        <PageHeader
            className="site-page-header"
            title="全球大新闻"
            subTitle="查看新闻"
        />
        <Row gutter={[16, 16]} style={{
            width: "100%"
        }}>
            { 
                dataSource.map(item=>
                    <Col span={8} key={item[0]} >
                        <Card title={item[0]} bordered={true}>
                            <List
                                size="large"
                                // bordered
                                dataSource={item[1]}
                                pagination={{
                                    pageSize: 3,
                                }}
                                renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>
                )
            }
        </Row>
    </div>
  )
}
