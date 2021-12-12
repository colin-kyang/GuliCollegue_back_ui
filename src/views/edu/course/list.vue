<template>
  <div class="app-container">
    课程列表
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <input v-model="searchObj.title" placeholder="课程名称">
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.status" placeholder="课程状态">
          <el-option :value="1" label="已发布" />
          <el-option :value="2" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>





    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{(page-1)*limit+scope.$index+1}}
        </template>

      </el-table-column>

      <el-table-column
        prop="title"
        label="课程名称"
        width="80">
      </el-table-column>
      <el-table-column
        label="课程状态"
        width="80">
        <template slot-scope="scope">
          {{scope.row.status==='Normal'? '已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="lessonNum"
        label="课时数">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="160">
      </el-table-column>

      <el-table-column
        prop="viewCount"
        label="浏览数量">
      </el-table-column>

      <el-table-column label="操作" width="200" align="center" >
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="removeCourse(scope.row.id)">课程删除</el-button>
        </template>
      </el-table-column>


    </el-table>

    <!--    分页条-->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding:30px 0;text-align:center;"
      layout="total,prev,pager,next,jumper"
      @current-change="getList"


    />

    <el-button type="text" @click="open"></el-button>
  </div>
</template>

<script>
import course from '@/api/course';
export default {
  name: "list",
  data(){
    return{
      list:null,  //查询之后，接口返回集合
      page:1,   //当前页
      limit:10, //每页记录数
      total:0,  //总记录数
      searchObj:{

      } //条件封装对象
    }
  },
  created()
  {this.getList()},
  methods:{
    getList(page=1){
      this.page=page;
      course.getCourseList(this.searchObj,this.limit,this.page)
      .then(
        response=>{
          this.list=response.data.rows
          this.total=response.data.total
        }
      )
    },
    removeCourse(courseId)
    {
      this.$confirm("此操作将删除此条课程，是否继续？",'删除提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(
        ()=>{
          //点击确定，执行删除操作
          course.removeCourse(courseId).then
          (
            response=>{
              this.$message({
                type:'success',
                message:'删除成功！'
              })
            this.getList(this.page);
            }
          )
        })
    }
  }
}
</script>

<style scoped>

</style>
