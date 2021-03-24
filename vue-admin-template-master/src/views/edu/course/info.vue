<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
<el-form label-width="120px">
  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>
  <!-- 所属分类 -->
  <el-form-item label="课程分类">
  <el-select v-model="courseInfo.subjectParentId" placeholder="一级分类" @change="subjectOnChange">
    <el-option
      v-for="subject in subjectOneList"
      :key="subject.id"
      :label="subject.title"
      :value="subject.id"/>
  </el-select>
  <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
    <el-option
      v-for="subject in subjectTwoList"
      :key="subject.id"
      :label="subject.title"
      :value="subject.id"/>
  </el-select>
</el-form-item>

  <!-- 课程讲师 下拉列表 -->
<el-form-item label="课程讲师">
  <el-select v-model="courseInfo.teacherId" placeholder="请选择">
    <el-option
      v-for="teacher in teacherList"
      :key="teacher.id"
      :label="teacher.name"
      :value="teacher.id"/>
  </el-select>
</el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>
  <!-- 课程简介 TODO --> 
  <el-form-item label="课程简介">
    <tinymce :height="300" v-model="courseInfo.description"/>
  </el-form-item>


  <!-- 课程封面 -->
<el-form-item label="课程封面(图片默认)" style="max-width:180px;hight:180px;">
  <el-upload
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :action="BASE_API+'/eduoss/fileoss'"
    class="avatar-uploader">
    <img :src="courseInfo.cover">
  </el-upload>
</el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>
  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存并下一步</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'//引入富文本编辑器
export default {
    components: { Tinymce },//申明富文本编辑器组件
    data(){
        return{
            saveBtnDisabled:false,
            courseInfo:{//基础数据定义
                title: '',
                subjectId: '',//一级分类
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '/static/654259.jpg',
                price: 0,
                subjectParentId:''//二级分类
            },
            courseId:'',
            BASE_API:process.env.BASE_API,//接口API地址
            teacherList:[], //讲师数据定义
            subjectOneList:[],//一级分类
            subjectTwoList:[]//二级分类
        }
    },
    created(){
      // 获取路由中的ID值
        if(this.$route.params && this.$route.params.id){
              this.courseId = this.$route.params.id
              this.getInfo()
        }else{
              // 初始化所有讲师
              this.getListTeacher()
              // 初始化一级分类
              this.subjectFirstList()
        }
    },
    watch:{ // 监听
        $route(to,from){// 路由变化方式，路由发生变化，方法就会执行
            console.log('watch $route')
            this.init()
        }
    },
    methods:{
      init(){
                // 判断路径中是否有id值
                //判断路径有id值,做修改
            if(this.$route.params && this.$route.params.id) {
                //从路径获取id值
                const id = this.$route.params.id
                //调用根据id查询的方法
                this.getInfo(id)
            }else{// 路径中没有ID值
                // 清空表单
                this.courseInfo = {}
            }
        },
      // 根据课程id查询
      getInfo(){
        course.getCourseInfoId(this.courseId).then(response =>{
            this.courseInfo = response.data.courseInfoVo
             // 在courseInfo课程基本信息中，包含了一级分类和二级分类
            
            // 先查询所有分类
            subject.getAllSubjectList().then(response =>{
              this.subjectOneList = response.data.list
              for (let i = 0; i < this.subjectOneList.length; i++) {
                var oneSubject = this.subjectOneList[i]
                // 当两个id相等的时候，则表示是同一级分类 
                if(this.courseInfo.subjectParentId == oneSubject.id){
                // 获取该一级分类下的所有二级分类
                  this.subjectTwoList = oneSubject.children
                }            
              }
            })

            // 初始化所有讲师
            this.getListTeacher()
        })
      }, 

      // 封面上传成功
      handleAvatarSuccess(res,file){
        // 返回相应的路径
        this.courseInfo.cover = res.data.url
      },
      // 上传之前调用的方法,用于校验文件类型 大小
      beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 传入一级分类的id来进行二级联动
      subjectOnChange(value){
          for (let i = 0; i < this.subjectOneList.length; i++) {
            // 获取一级分类
            var oneSubject = this.subjectOneList[i]
            if(value === oneSubject.id){
                this.subjectTwoList =  oneSubject.children
                this.courseInfo.subjectId = '' //双向绑定原因要清空数据
            }        
          }
      },
      // 查询一级分类
      subjectFirstList(){
          subject.getAllSubjectList().then(response =>{
            this.subjectOneList = response.data.list
          })
      },
      // 查询所有讲师
      getListTeacher(){
        course.getListTeacher().then(response =>{
          this.teacherList =  response.data.items
        })
      },
      addCourse(){
        course.addCourseInfo(this.courseInfo).then(response =>{
          // 提示信息
          this.$message({
            type:'success',
            message:'添加课程信息成功！'
          });
          // 跳转到第二步
        this.$router .push({path:'/course/chapter/'+response.data.courseId})
        })
      },
      updateCourse(){
        course.updateCourseInfoId(this.courseInfo).then(response =>{
          // 提示信息
          this.$message({
            type:'success',
            message:'修改课程信息成功！'
          });
           this.$router.push({path:'/course/chapter/'+this.courseId})
        })
      },
      saveOrUpdate(){
          if(!this.courseInfo.id){
              this.addCourse()
          }else{
            this.updateCourse()
          }
      }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
