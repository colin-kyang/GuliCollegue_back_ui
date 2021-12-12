<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <input v-model="searchObj.name" placeholder="讲师名">
      </el-form-item>


      <el-form-item>
        <el-select v-model="searchObj.level" placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师"/>
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
        prop="name"
        label="名称"
        width="80">
      </el-table-column>
      <el-table-column
        label="头衔"
        width="80">
        <template slot-scope="scope">
          {{scope.row.level===1? '高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="intro"
        label="资历">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="添加时间"
      width="160">
      </el-table-column>

      <el-table-column
        prop="intro"
        label="资历">
      </el-table-column>

      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center" >
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>

          <el-button type="danger" icon="el-icon-delete" @click="removeDataById(scope.row.id)" circle></el-button>
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

    <el-button type="text" @click="open">点击打开 Message Box</el-button>
  </div>
</template>

<script>
//引入teacher.js 文件
import teacher from "../../../api/teacher";

export default {
  //写核心代码的位置
  name: "list",
  data:function (){
    return {
      list:null,
      page:1,
      limit:5,
      total:0,
      tabledata:[

      ],
      searchObj:{

      }

    }
  },
  created(){
    //页面渲染之前执行
    this.getList();
  },
  methods:{
    //创建具体的方法，调用teacher.js中所定义的方法
    //添加方法，前面会自动传参
    getList(page=1)
    {
      this.page=page
      teacher.getTeacherPageList(this.page,this.limit,this.searchObj)
      .then(
        response=>
        {
          //请求成功
          //response接口返回的数据
          this.list=response.data.rows
          this.total=response.data.total
        }
      )
      .catch(

      );
    },
    resetData()
    {
      //清空：1.表单输入项数据
      //查询所有数据
    this.searchObj= {};
    this.getList();
    },
    removeDataById(id)
    {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.removeTeacherById(id)
          .then(
            response=>
            {
              //删除成功，展示提示成功
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //需要重新刷新列表页面
              this.getList();
            }
          )
      }).catch(() => {
      });

    }

  }
}
</script>

<style scoped>

</style>
