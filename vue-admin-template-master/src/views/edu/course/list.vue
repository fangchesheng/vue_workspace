<template>
    <div class="app-container">
     <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="1" label="已发布"/>
          <el-option :value="2" label="未发布"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getlist()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" :row-class-name="tableRowClassName" element-loading-text="数据加载中"  border  fit highlight-current-row>
      <el-table-column
        label="序号"
        width="40"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="180" />
      <el-table-column label="课程状态" width="180">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="160"/>
      <el-table-column prop="gmtCreate" label="添加时间" width="170"/>
      <el-table-column prop="viewCount" label="浏览数量" width="180" />
      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑信息</el-button>
          </router-link>
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
   <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getlist"
    />
    </div>
</template>
<script>
// 引入调用teacher.js文件
import course from '@/api/edu/course'
export default {
    // 写核心代码的地方
    data(){ // 定义变量和初始值
        return{
            list:null,//查询之后接口返回集合
            page:1,//当前页
            limit:10,// 每页记录数
            total:0,//总记录数
            courseQuery:{}// 条件封装对象
        }
    },
    created(){// 页面渲染之前执行，一般调用methods定义的方法
        this.getlist()
    },
    methods:{// 创建具体的方法，调用teacher.js定义的方法
        getlist(page = 1){
            this.page = page
            course.getCourseList(this.page,this.limit,this.courseQuery)
            .then(response =>{// 请求返回成功
                // response 接口返回的数据
                this.list = response.data.list
                this.total = response.data.total
            })
            .catch( // 请求返回失败
                error =>{console.log(error)} 
            )
        },
        resetData() { // 清空数据
            // 表单输入数据清空
            this.courseQuery = {}
            // 查询所有数据
            this.getlist()
        },
         removeDataById(id) {
            // let _this = this;                                                                 
            this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                course.deleteCourseInfo(id)
                    .then(response =>{//删除成功
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //回到列表页面
                  this.getlist()
                })
                
            }) .catch(//点击取消，执行catch方法
                 error =>{console.log(error)}
            )
        },
        // 隔行变色
        tableRowClassName({row, rowIndex}){
        if (rowIndex%2 === 0) {
            return 'warning-row';
        } else if (rowIndex%2 === 1) {
            return 'success-row';
        }
      },
    }

}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>