import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

function usePublish(type) {
    const { username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username, type])

    // 上线
    const handlePublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now(),
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到[发布管理/已发布]中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    // 下线
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到[发布管理/已下线]中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    // 删除
    const handleDelete = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您已经删除了已下线的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
    }
}

export default usePublish