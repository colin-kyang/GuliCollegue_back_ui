<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                    <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
        </p>

        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.videoList"
            :key="video.id">
            <p>{{ video.title }}

              <span class="acts">

                    <el-button style=""  type="text" @click="openEditVideo(video.id)" >编辑</el-button>
                    <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>


    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            name="file"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :before-upload="onBeforeUpload"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/uploadVod'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import chapterService from '@/api/chapter';
import videoService from '@/api/video';
export default {
  name: "chapter",
  data() {
    return {
      saveBtnDisabled:false,
      chapterVideoList:[],
      course_id:'',
      dialogChapterFormVisible:false,
      dialogVideoFormVisible:false,
      saveVideoBtnDisabled:false,
      chapter:{
        id:'',
        courseId:'',
        title:'',
        sort:''
      },
      video:{
        id:'',
        title:'',
        courseId:'',
        chapterId:'',
        sort:'',
        isFree:'',
        videoSourceId:'',
        videoOriginalName:''
      },
      fileList:[],
      BASE_API:process.env.BASE_API
    }
  },
  created() {
    //获取路由id
    if(this.$route.params && this.$route.params.id)
    {
      this.course_id=this.$route.params.id;
    }
    console.log(this.course_id);
    this.getAllChapterVideo(this.course_id);
  },
  methods:{
    previous() {
      this.$router.push({path:'/course/info/'+this.course_id})
    },
    next() {
      //跳转到第二步
      this.$router.push({path:'/course/publish/'+this.course_id})
    },
    getAllChapterVideo(id)
    {
      chapterService.getAllChapterVideo(id).then(
        response=>{
          this.chapterVideoList=response.data.allChapterVideo;
        }
      )
    },
    //==============================小节=========================
    openVideo(chapterId)
  {
    this.video={
      id:'',
      title:'',
      courseId:'',
      chapterId:'',
      sort:'',
      isFree:'',
      videoSourceId:'',
      videoOriginalName:''};
    this.fileList=[];
    this.dialogVideoFormVisible=true;
    this.video.courseId=this.course_id;
    this.video.chapterId=chapterId;
  },
    saveOrUpdateVideo()
    {
      console.log(this.video);
      if(this.video.isFree=='1')
      {
        this.video.isFree=1;
      }
      else
      {
        this.video.isFree=0;
      }
      if(this.video.id!='')
      {
        //更新操作
        videoService.updateVideo(this.video)
        .then(
          response=>
          {
            this.$message({
              type:'success',
              message:'小节更新成功！'
            });
            this.getAllChapterVideo(this.course_id);
          }
        )
      }
      else
      {
        //添加操作
        videoService.addVideo(this.video)
          .then(
            response=>{
              this.$message({
                type:'success',
                message:'添加小节成功！'
              });
              this.getAllChapterVideo(this.course_id);
            }
          )
      }
      //关闭弹窗
      this.dialogVideoFormVisible=false;

      //添加完毕后，删除video
      this.video={
        id:'',
        title:'',
        courseId:'',
        chapterId:'',
        sort:'',
        isFree:'',
        videoSourceId:''
      }
    },
    removeVideo(videoId)
    {
      this.$confirm("此操作将删除此条小节，是否继续？",'删除提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(
        ()=>{
          //点击确定，执行删除操作
          videoService.deleteVideo(videoId)
            .then(
              response=> {
                this.$message({
                  type: 'success',
                  message: '删除该小节成功！'
                });
                this.getAllChapterVideo(this.course_id);
              })
    })},
    openEditVideo(videoId)
    {
      this.fileList=[];
      this.dialogVideoFormVisible=true;
      this.video.id=videoId;
      videoService.getVideo(videoId)
      .then(
        response=>{
          this.video=response.data.video;
          this.fileList.push({uid:'1',name:this.video.videoOriginalName});
        }
      )
    },
    //=================================章节======================
    saveOrUpdate()
    {
      if(this.chapter.id!=''){
        this.chapter.courseId=this.course_id;
        console.log(this.chapter);
        chapterService.updateChapter(this.chapter)
          .then(
            response=>{
              //关闭弹框
              this.dialogChapterFormVisible=false;
              //提示信息
              this.$message(
                {
                  type:'success',
                  message:'编辑章节成功'
                }
              );
              this.getAllChapterVideo(this.course_id);
            }
          )
      }
      else
      {
        this.chapter.courseId=this.course_id;
        chapterService.addChapter(this.chapter)
          .then(
            response=>{
              //关闭弹框
              this.dialogChapterFormVisible=false;
              //提示信息
              this.$message(
                {
                  type:'success',
                  message:'添加章节成功'
                }
              );
              this.getAllChapterVideo(this.course_id);
            }
          )
      }
    },
    openChapterDialog()
    {
      this.dialogChapterFormVisible=true;
    },
    openEditChatper(chapterId)
    {
      this.dialogChapterFormVisible=true;
      chapterService.getChapter(chapterId)
      .then(
        response=>
        {
          this.chapter=response.data.chapter;
          console.log(this.chapter);
        }
      )},
    removeChapter(ChapterId)
    {
      this.$confirm("此操作将删除此条章节信息，是否继续？",'删除提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then
      (
        ()=>{
          //点击确定，执行删除操作
          chapterService.delete(ChapterId)
          .then(
            response=>{
              this.$message({
                type:'success',
                message:'删除该章节成功！'
              });
              this.getAllChapterVideo(this.course_id);
            }
          )
        }
      )
    },
    handleVodUploadSuccess(response,file,fileList){
      //更新章节信息
      this.video.videoSourceId=response.data.videoSourceId;
      this.video.videoOriginalName= file.name;
    },
    handleUploadExceed()
    {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频');
    },
    handleVodRemove()
    {
      //删除视频动作
      videoService.removeVideoById(this.video.videoSourceId)
      .then(
        resonse=>{
          this.$message({
            type:'success',
            message:"删除成功"
          })
          this.fileList=[]
          this.video.videoSourceId="";
          this.video.videoOriginalName="";
        }
      )


    }


  }
}
</script>

<style scoped>

</style>
