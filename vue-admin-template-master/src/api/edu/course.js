import request from '@/utils/request'

export default{
    // 添加课程
    addCourseInfo(courseInfo){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data:courseInfo
          })
    },
    // 查询所有讲师
    getListTeacher(){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: `/eduservice/teacher/findAll`,
            method: 'get'
          })
    },
    // 根据课程Id查询课程基本星系
    getCourseInfoId(id){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/course/getCourseInfo/'+id,
            method: 'get'
        })
    },
    // 修改课程信息
    updateCourseInfoId(courseInfo){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/course/updateCourseInfo',
            method: 'post',
            data:courseInfo
        })
    },
    // 课程确认信息显示
    getPublishCourseInfo(id){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/course/getPublishCourseInfo/'+id,
            method: 'get'
        })
    },
    // 课程确认信息显示
    publicCourseInfo(id){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/course/publicCourse/'+id,
            method: 'post'
        })
    },
    // 课程列表查询
    getCourseList(current,limit,courseQuery){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: `/eduservice/course/getCoursePage/${current}/${limit}`,
            method: 'post',
            data:courseQuery
        })
    },
    // 删除课程信息
    deleteCourseInfo(id){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: '/eduservice/course/deleteCourseInfo/'+id,
            method: 'get'
        })
    },
}