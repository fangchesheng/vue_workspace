<template>
    <div class="app-container">    
    <el-form label-width="120px" :model="teacher" :rules="rules" ref="teacher">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name" maxlength="20"/>
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number v-model.number="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      
      <!-- 讲师头像：TODO -->
        <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 
        <input type="file" name="file"/>
      -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate('teacher')">保存</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>
<script>
import teacherAPI from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components:{ImageCropper,PanThumb},
    data(){
        return{
            teacher:{
                name: '',
                sort: 0,
                level: 1,
                sort: '',
                intro: '',
                avatar: ''
            },
            // 上传组件是否显示
            imagecropperShow:false,
            imagecropperKey:0,//上传组件key值
            BASE_API:process.env.BASE_API,//获取dev.env.js中的地址
            saveBtnDisabled:false,// 保存按钮是否禁用
            rules:{
                name: [
                   { required: true, message: '请输入课讲师名称', trigger: 'blur' },
                   { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: "请输入讲师排序", trigger: "blur" },
                    { type: "number", message: "排序必须为整数" }
                ],
                level: [{ required: true, message: '请选择讲师头衔', trigger: 'change' }],
                career:[
                  { required: true, message: '请输入课讲师资历', trigger: 'blur' },
                  { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                intro:[
                  { required: true, message: '请输入课讲师简介', trigger: 'blur' },
                  { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ]
                
            },
        }
    },
    created(){// 页面渲染之前执行
      this.init()
        
    },
    watch:{ // 监听
        $route(to,from){// 路由变化方式，路由发生变化，方法就会执行
            console.log('watch $route')
            this.init()
        }
    },
    methods:{
        close(){//关闭上传弹框的方法
            this.imagecropperShow=false
            this.imagecropperKey = this.imagecropperKey +1
        },
        cropSuccess(data){//上传成功的方法
        // 上传之后接口返回图片地址
            this.imagecropperShow=false
            this.teacher.avatar=data.url
            this.imagecropperKey = this.imagecropperKey +1
        },
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
                this.teacher = {}
            }
        },
        getInfo(id){
            teacherAPI.getTeacherInfo(id).then(
                response => {
                    this.teacher = response.data.teacher
                }
            )
        },
        // 添加讲师
        saveOrUpdate(teacher){
            this.$refs[teacher].validate((valid) => {
          if (valid) {
             // 判断是修改还是添加
            // 根据teacher是否有ID
            if (!this.teacher.id) {
                this.saveTeacher()
            }else{
                this.uodateTeacher()
            }
          } else {
            alert('请正确填写信息');
            return false;
          }
        });  
        },
        // 修改讲师
        uodateTeacher(){
            teacherAPI.updateTeacherInfo(this.teacher).then(response => {
                 // 提示成功
                this.$message({ 
                    type: 'success',
                    message: '修改成功!'
                });
                // 回到列表页 路由跳转 重定向
               this.$router.push({ path: '/teacher/table' })
            })
        },
        saveTeacher(){
            //  teacherAPI.addTeacher
            teacherAPI.addTeacher(this.teacher)
            .then(response => { //添加成功
                // 提示成功
                this.$message({ 
                    type: 'success',
                    message: '添加成功!'
                });
                // 回到列表页 路由跳转 重定向
               this.$router.push({ path: '/teacher/table' })

            })
        }
    }
}
</script>