<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <!-- 章节 -->
<el-button type="text" @click="openChapterDialog()">添加章节</el-button>
<ul class="chapterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{chapter.title}}
            <span class="acts">
                <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>
        <!-- 视频 -->
        <ul class="videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
                </p>
            </li>
        </ul>
    </li>
</ul>
<div>
    <el-button @click="previous">上一步</el-button>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
</div>

<el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节" >
  <el-form :model="chapter" label-width="120px">
    <el-form-item label="章节标题">
      <el-input v-model="chapter.title"/>
    </el-form-item>
     <el-form-item label="章节排序">
      <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogChapterFormVisible=false">取 消</el-button>
    <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
  </div>
</el-dialog>

<!-- 添加小节 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节" >
  <el-form :model="video" label-width="120px">
    <el-form-item label="课时标题">
      <el-input v-model="video.title"/>
    </el-form-item>
     <el-form-item label="课时排序">
      <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="是否免费">
      <el-radio-group v-model="video.isFree" :min="0" controls-position="right">
        <el-radio :label="false">免费</el-radio>
        <el-radio :label="true">默认</el-radio>
      </el-radio-group> 
    </el-form-item>
    <el-form-item label="上传视频">
      <!-- TODO -->
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible=false">取 消</el-button>
    <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>

</div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
    data(){
        return{
            saveBtnDisabled:false,
            courseId:'',
            chapterVideoList:[],
            dialogChapterFormVisible:false,//章节弹框设置
            chapter:{
              title:'',
              sort:0
            },
            video:{
              title:'',
              sort:0,
              isFree:0,
              videoSourceId:''
            },
            dialogVideoFormVisible:false//小节弹框设置
            // saveVideoBtnDisabled:false
        }
    },
    created(){
      // 获取路由中的id值
      if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getChapterVideo()
      } 
    },
    methods:{
      // 删除小节
      removeVideo(id){
        this.$confirm('此操作将删除小节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用查询接口
                video.deleteVideo(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除小节成功!'
                    });
                    //刷新页面
                    this.getChapterVideo()
                })
            }).catch(e=>e); //点击取消，执行catch方法 这个.catch()删除掉就会打印Uncaught (in promise) cancel
      },


      // 添加小节弹框
      openVideo(chapterId){
          this.dialogVideoFormVisible=true
          // 设置章节Id
          this.video.chapterId = chapterId
           // 表单数据清空
          this.video.title=''
          this.video.sort=0
          this.video.free=0
          this.video.videoSourceId=''
      },
      addVideo(){
        // 设置课程ID
        this.video.courseId = this.courseId
        video.addVideo(this.video).then(response =>{
              this.dialogVideoFormVisible=false//管闭弹框
              this.$message({// 添加提示
                  type: 'success',
                  message: '添加小节成功!'
              });
              //刷新页面
              this.getChapterVideo()
        })
      }, 

           // 修改章节的方法
      openEditVideo(videoId){
        debugger
        // 弹框显示
        this.dialogVideoFormVisible=true
        // 调用查询接口
        video.getVideo(videoId).then(response =>{
          this.video = response.data.video
        })
      },
        // 修改章节
      updateVideo(){
        // 设置课程ID到chapter中
          this.video.courseId = this.courseId
          video.updateVideo(this.video).then(response =>{
            // 关闭弹框
            this.dialogVideoFormVisible=false
            // 提示
            this.$message({
              type:'success',
              message:'修改章节成功！'
            });
            // 刷新页面
            this.getChapterVideo()
          })   
      },
      saveOrUpdateVideo(){
        if(this.video.id){
          this.updateVideo()
        }else{
          this.addVideo()
        }
      },


      //------ 下面时章节操作,上面时小节操作------
      // 删除章节
      removeChapter(chapterId){
        this.$confirm('此操作将删除章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用查询接口
                chapter.deleteChapter(chapterId)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //刷新页面
                    this.getChapterVideo()
                })
            }).catch(e=>e); //点击取消，执行catch方法 这个.catch()删除掉就会打印Uncaught (in promise) cancel
      },

      // 修改章节的方法
      openEditChapter(chapterId){
        // 弹框显示
        this.dialogChapterFormVisible=true
        // 调用查询接口
        chapter.getChapter(chapterId).then(response =>{
          this.chapter = response.data.chapter
        })
      },

      // 弹出章节的页面
      openChapterDialog(){
        // 弹框
        this.dialogChapterFormVisible=true
        // 表单数据清空
        this.chapter.title=''
        this.chapter.sort=0
      },
      // 添加章节
      addChapter(){
        // 设置课程ID到chapter中
          this.chapter.courseId = this.courseId
          chapter.addChapter(this.chapter).then(response =>{
            // 关闭弹框
            this.dialogChapterFormVisible=false
            // 提示
            this.$message({
              type:'success',
              message:'添加章节成功！'
            });
            // 刷新页面
            this.getChapterVideo()
          })   
      },
      // 修改章节
      updateChapter(){
        // 设置课程ID到chapter中
          this.chapter.courseId = this.courseId
          chapter.updateChapter(this.chapter).then(response =>{
            // 关闭弹框
            this.dialogChapterFormVisible=false
            // 提示
            this.$message({
              type:'success',
              message:'修改章节成功！'
            });
            // 刷新页面
            this.getChapterVideo()
          })   
      },
      // 添加章节
      saveOrUpdate(){
        if(this.chapter.id){
          this.updateChapter()
        }else{
          this.addChapter()
        }
          
      },
  
      // 根据课程ID来查询数据
        getChapterVideo(){
          chapter.getAllChapterVideo(this.courseId).then(response => {
           this.chapterVideoList = response.data.allChapterVideo
          })
        },
        previous(){
            // 跳转到第一步
            this.$router.push({path:'/course/info/'+this.courseId})
        },
        next(){
            // 跳转到第三步
            this.$router.push({path:'/course/publish/'+this.courseId})
        }
    }
}
</script>
<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 5px 0;
  padding: 10px;
  height: 50px;
  line-height: 40px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts{
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>