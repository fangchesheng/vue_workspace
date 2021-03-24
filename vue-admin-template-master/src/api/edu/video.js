import request from '@/utils/request'

export default{
    // 增
    addVideo(video){
        return request({
            // 路径拼接参数两种写法
            url: '/eduservice/eduVideo/addVideo',
            method: 'post',
            data:video
          })
    },
    // 删
    deleteVideo(id){
        return request({
            // 路径拼接参数两种写法
            url: '/eduservice/eduVideo/deleteVideo/'+id,
            method: 'get'
        })
    },
    // 改
    updateVideo(video){
        return request({
            // 路径拼接参数两种写法
            url: '/eduservice/eduVideo/updateVideo',
            method: 'post',
            data:video
          })
    },
     // 查
     getVideo(id){
        return request({
            // 路径拼接参数两种写法
            url: '/eduservice/eduVideo/getVideoById/'+id,
            method: 'get'
          })
    }

}