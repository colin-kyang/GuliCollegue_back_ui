<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">

          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>

        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>


      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">

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
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>


      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="'http://localhost:8002/eduoss/fileoss/uploadFile'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/course'
import subject from '@/api/subject'
import Tinymce from  '@/components/Tinymce'
export default {
  components:{Tinymce},
  name: "info",
  data(){
    return{
      saveBtnDisabled:false,
      courseInfo:{
        id:'',
        title: '',
        subjectId: '',//二级分类id
        subjectParentId:'',//一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/01.jpg',
        price: 0,
        courseId:''
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      teacherList:[],//封装所有的讲师
      subjectOneList:[],//一级分类
      subjectTwoList:[]//二级分类
    }
  },
  created() {
    if(this.$route.params && this.$route.params.id)
    {
      this.getList();
      this.init();
    }
    else
    {

      this.getList();
      this.getOneSubject();
    }
  },
  methods:{
    next(id){
      this.$router.push({path:'/course/chapter/'+id})
    },
    saveOrUpdate()
    {
      if(this.$route.params && this.$route.params.id)
      {
        course.updateCourseInfo(this.courseInfo)
          .then(
            response=>
            {
              //更新成功
              this.$message({
                type:'success',
                message:'更新课程信息成功！'
              })
              this.next(this.courseInfo.id);
            }
          )
      }
      else
      {
        course.addCourseInfo(this.courseInfo)
          .then(response=>{
            //提示成功
            this.$message({
              type:'success',
              message:'添加课程信息成功！'
            })
            console.log(response.data.courseId);
            this.next(response.data.courseId);
          })
      }


    },
    getList()
    {
        course.getListTeacher()
      .then(response=>{
          this.teacherList=response.data.items;
      })
    },
    getOneSubject()
    {
      subject.getSubjectList()
      .then(response=>
      {
        this.subjectOneList=response.data.list;
      })
    },
    subjectLevelOneChanged(value)
    {
      this.optionClear();
      for(var i=0;i<this.subjectOneList.length;i++)
      {
        var oneSubject=this.subjectOneList[i];
        if(value===oneSubject.id)
        {
          //从一级分类中获取所有二级分类
          this.subjectTwoList=oneSubject.children;
        }
      }
    },
    optionClear(){
      this.courseInfo.subjectId='';
    },
    handleAvatarSuccess(res,file){
      this.courseInfo.cover=res.data.url;

    },
    beforeAvatarUpload(file){
      const isJPG=file.type==='image/jpeg';
      const isLt2M=file.size/1024/1024 <2;
      if(!isJPG)
      {
        this.$message.error('上传的头像图片只能是jpg格式');
      }
      if(!isLt2M)
      {
        this.$message.error('上传的头像图片不可超过2MB！');
      }
      return isJPG && isLt2M;
    },
    init()
    {
      if(this.$route.params&&this.$route.params.id)
      {
        this.course_id=this.$route.params.id;
        course.getCourseInfoById(this.course_id)
          .then(
            response=>{
              //在课程基本信息中，同时包含两个值
              this.courseInfo=response.data.courseInfo;
              //1.查询所有分类
              subject.getSubjectList()
              .then(
                response=>
                {
                  //获取所有一级分类
                  this.subjectOneList=response.data.list;
                  //遍历所有一级分类，比较当前中一级分类是否相同
                  for(var i=0;i<this.subjectOneList.length;i++)
                  {
                    var oneSubject=this.subjectOneList[i];
                    //比较
                    if(this.courseInfo.subjectParentId===oneSubject.id)
                    {
                      this.subjectTwoList=oneSubject.children;
                    }
                  }
                }
              )
            }
          )
      }
    }
  }
}
</script>

<style scoped>

</style>
