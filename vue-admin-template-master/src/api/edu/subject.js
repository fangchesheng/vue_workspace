import request from '@/utils/request'

export default{
    // 课程分类
    getAllSubjectList(){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
          })
    }
}