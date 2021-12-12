<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publishCourse">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import course from '@/api/course';
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      id: '',
      coursePublish:
        {

        }
    }
  },

  created() {
    //获取路由课程id值
    if(this.$route.params && this.$route.params.id)
    {
      this.id=this.$route.params.id
    }
    //调用接口方法，根据课程id查询
    this.getpublishcourseinfo();
  },

  methods: {
    previous() {
      console.log('previous')
      console.log(this.id)
      this.$router.push({ path: '/course/chapter/'+this.id })
    },

    publish() {
      console.log('publish')
      this.$router.push({ path: '/course/list' })
    },
    getpublishcourseinfo()
    {
      course.getPublishCourseInfo(this.id)
      .then
      (
        response=>{
          this.coursePublish=response.data.data;
          console.log(this.publishCourseInfo);
        }
      )
    },
    publishCourse()
    {
      this.$confirm("此操作将发布此项课程信息，是否继续？",'确认提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then
      (
        ()=>{
          //点击确定，执行发布操作
          course.publishCourse(this.id)
          .then(
            response=>{
              this.$message({
                type:'success',
                message:'发布课程成功'
              });
              this.$router.push({path:"/course/list"});
            }
          )

        }
      )

    }

  }
}
</script>
