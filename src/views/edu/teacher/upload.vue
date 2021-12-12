<template>
  <el-upload
    class="upload-demo"
    action=""
    :http-request="upload">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>


</template>



<script>
import {uplaod} from "../../../api/uploadImg";
import axios from 'axios'
export default {
  name: "upload",
  data:function () {
    return {
      imageUrl: ''
    };
  },
  methods: {
    upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      const url = 'http://127.0.0.1:36677/upload'
      axios.post(url, formData).then(data => {
        console.log('上传图片成功')
      }).catch(response => {
        console.log('图片上传失败')
      })
    }

  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
