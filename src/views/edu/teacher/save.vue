<template>
  <div class="app-container">
    讲师表单
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
<!--      <el-input v-model="teacher.id" v-show=false />-->
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <pan-thumb :image="teacher.avatar"/>
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
        <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            :url="`http://localhost:8002/eduoss/fileoss/uploadFile`"
            field="file"
            @close="close"
            @crop-upload-success="cropSuccess"
        >
        </image-cropper>

      </el-form-item>


<!--      diabled 表示保存按钮是否禁用-->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

    <el-button type="text" ></el-button>
  </div>
</template>

<script>
import teacherApi from "../../../api/teacher";
import PanThumb from "../../../components/PanThumb";
import {BASE_API} from "../../../../config/prod.env";
import ImageCropper from "../../../components/ImageCropper"

export default {
  name: "save",
  components: {PanThumb,ImageCropper},
  data:function(){
      return {
    teacher:{
        name:'',
        sort:0,
        level:1,
        career:'',
        intro:''
      },
        saveBtnDisabled:false, //保存按钮
        imagecropperShow:false,
        imagecropperKey:0,
        BASE_API:BASE_API//获取地址
  }},
  methods:{
    saveOrUpdate(){
        //修改存在id值
      if(this.teacher.id)
      {
        //存在id值，调用修改
        this.updateTeacher();
      }
      else
      {
        //不存在id值，调用添加
        this.saveTeacher();
      }
    },
    saveTeacher()
    {
    teacherApi.addTeacher(this.teacher)
    .then(
      response=>{
        this.$alert('成功', '添加成功！', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
        //回到列表页面——路由重定向
        this.$router.push({path:'/teacher/table'});
      }
    );
    },
    //根据讲师id查询的方法
    getInfo(id)
    {

      teacherApi.getTeacherInfo(id)
      .then(
        response=>{
          //数据值是双向绑定
          this.teacher=response.data.teacher;
        }
      )
    },
    updateTeacher()
    {
      console.log(this.teacher);
      teacherApi.updateTeacher(this.teacher)
      .then(
          response=>{
            this.$message(
              {
                type:'success',
                message:'修改成功！'
              }
            );
            //回到列表页面——路由重定向
            this.$router.push({path:'/teacher/table'});
          }
      );
    },
    cropSuccess(data)
    {
      this.teacher.avatar=data.url;

    },
    close()
    {
      //关闭上传弹框的方法
      this.imagecropperShow=false;
      //上传组件初始化
      this.imagecropperKey=this.imagecropperKey+1;
    }

  },
  created() {
    //判断路径中是否存在id值，做添加
    if (this.$route.params && this.$route.params.id)
    {
      const id =this.$route.params.id;
      this.teacher.id=id;
      this.getInfo(id);
    }
  },
  watch:{
    //监听
    $route(to,from){
      //路由变化方式，路由发生变换，方法就会执行
      this.init();
    }
  }
}
</script>

<style scoped>

</style>
