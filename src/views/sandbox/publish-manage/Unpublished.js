import React, { useRef } from 'react'
import { Button } from 'antd'
import usePublish from '../../../components/publish-manage/usePublish';
import NewsPublish from '../../../components/publish-manage/NewsPublish';

/**
 * 待发布
 * @returns 待发布
 */
export default function Unpublished() {
  const {dataSource, handlePublish} = usePublish(1)
  // console.log(dataSource)

  return (
    <div className='dataSource'>
      <NewsPublish dataSource={ dataSource } button={(id)=> <Button type='primary' onClick={()=> handlePublish(id) }>上线</Button> } />
    </div>
  )
}