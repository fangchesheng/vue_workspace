import request from '@/utils/request'

export default{
    // 讲师列表（条件分页查询）
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // params
            // teacherQuery条件对象，后台使用requestbody获取数据
            // data表示把对象转换json进行传递到接口里面
            data:teacherQuery
          })
    },
    deleteTeacherId(id){
        return request({
            // 路径拼接参数两种写法
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'limit',
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
          })
    },
    addTeacher(teacher){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data:teacher
        })
    },
    getTeacherInfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    // 修改讲师
    updateTeacherInfo(teacher){
        return request({
            url: `/eduservice/teacher/updateteacher`,
            method: 'post',
            data:teacher
        })
    }
    
}