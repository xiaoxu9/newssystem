import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Sunset() {
  // 2 ===> 已发布
  const {dataSource, handleDelete} = usePublish(3)  // handleSunset 下线方法

  return (
    <div className='dataSource'>
      <NewsPublish dataSource={ dataSource } button={(id)=> <Button danger onClick={()=> handleDelete(id) }>删除</Button> } />
    </div>
  )
}
