import axios from 'axios'
import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

/**
 * 已发布
 * @returns 已发布
 */
export default function Published() {
  // 2 ===> 已发布
  const {dataSource, handleSunset} = usePublish(2)  // handleSunset 下线方法

  return (
    <div className='dataSource'>
      <NewsPublish dataSource={ dataSource } button={(id)=> <Button danger onClick={()=> handleSunset(id) }>下线</Button> } />
    </div>
  )
}
