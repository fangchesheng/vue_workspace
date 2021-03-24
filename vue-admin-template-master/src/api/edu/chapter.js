import request from '@/utils/request'

export default{
    // 根据课程Id获取章节和小节数据列表
    getAllChapterVideo(courseId){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/chapter/getChapterVideo/'+courseId,
            method: 'get'
          })
    },
    // 增
    addChapter(chapter){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/chapter/addChapter',
            method: 'post',
            data:chapter
          })
    },
    // 删
    deleteChapter(chapterId){
        return request({
            // 路径拼接参数两种写法
            url: '/eduservice/chapter/deleteChapter/'+chapterId,
            method: 'delete'
        })
    },
    // 改
    updateChapter(chapter){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/chapter/updateChapter',
            method: 'post',
            data:chapter
          })
    },
     // 查
     getChapter(chapterId){
        return request({
            // 路径拼接参数两种写法
            url: '/eduservice/chapter/getChapterInfo/'+chapterId,
            method: 'get'
          })
    }

}