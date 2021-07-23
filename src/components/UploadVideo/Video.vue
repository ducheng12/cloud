<!--视屏上传组件-->
<template>
  <div class="container">
    <el-upload
      class="avatar-uploader el-upload--text"
      :show-file-list="false"
      :action="uploadUrl"
      :on-progress="uploadVideoProcess"
      :on-success="handleListSuccess"
      :before-upload="beforeuploadvideo"
      :data="data"
    >
      <video
        v-if="videoForm.showVideoPath != '' && videoFlag == false"
        :src="videoForm.showVideoPath"
        class="avatar video-avatar"
        controls="controls"
      >
        您的浏览器不支持视频播放
      </video>
      <el-progress
        v-if="videoFlag == true"
        type="circle"
        :percentage="videoUploadPercent"
        style="margin-top: 30px"
      ></el-progress>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      videoFlag: false,
      // 是否显示进度条
      videoUploadPercent: '',
      // 进度条的进度，
      isShowUploadVideo: false,
      // 显示上传按钮
      videoForm: {
        showVideoPath: null
      },
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: `${process.env.VUE_APP_FILE_URL}/file/uploadFile`,
      // uploadUrl: `${
      //   process.env.VUE_APP_BASE_API
      // }/cloudApi/datacenter/file/uploadFile`,
      data: {
        useDay: 1,
        //      path: "middleground/storeclass",
        path: 1,
        fileType: 2
      },
      fileList: [],
      pathList: [],
      allUrlString: '',
      imgIp: this.proce
    }
  },
  watch: {
    url(val) {
      this.videoForm.showVideoPath = `${process.env.VUE_APP_FILE_URL_OBS}/` + val
      //   // this.fileList = [];
      //   // if (!val) return;
      //   // for (let i = 0; i < val.length; i++) {
      //   //   let obj = {};
      //   //   obj = {
      //   //     name: "图片",
      //   //     url: `${process.env.VUE_APP_FILE_URL_OBS}/` + val[i],
      //   //     urls: val[i]
      //   //   };
      //   //   // this.fileList = []
      //   //   this.fileList.push(obj);
      //   //   this.videoForm.showVideoPath = `${process.env.VUE_APP_FILE_URL_OBS}/` +this.fileList[0].url
      //   // }
    }
  },
  methods: {
    // 上传前回调
    beforeuploadvideo(file) {
      const isVideo = file.type === 'video/mp4' || file.type === 'video/webm'
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isVideo) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传视频大小不能超过50MB哦!')
        return false
      }
      return isVideo && isLt50M
      // this.isshowuploadvideo = false
    },
    // 上传进度
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = parseInt(file.percentage.toFixed(0))
    },
    // 清空图片数组
    handleRemoveempty() {
      this.fileList = []
    },
    handleRemove(file, fileList) {
      // 重置预览数据
      // this.fileList = fileList;
      // // 删除路径数组内对应的元素
      // for (const index in this.pathList) {
      //   if (
      //     `${process.env.VUE_APP_FILE_URL}/${this.pathList[index]}` === file.url
      //   ) {
      //     this.pathList.splice(index, 1);
      //   }
      // }
      // // 重置路径合集字符串
      // this.allUrlString = this.pathList.join(",");
      // const data = {
      //   fileLsit: this.fileList,
      //   pathList: this.pathList,
      //   allUrlString: this.allUrlString
      // };
      // this.$emit("upload_over", data);
      // this.$emit("onremove", this.fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功
    handleListSuccess(res, file) {
      this.videoFlag = false
      if (res.code === 200) {
        this.videoForm.showVideoPath = res.data.ip + '/' + res.data.fileUrl
        this.$message({ message: '上传视屏成功', type: 'success' })
        // const obj = {
        //   name: "图片",
        //   url: res.data.ip + "/" + res.data.fileUrl,
        //   urls: res.data.fileUrl
        // };
        // // 添加入预览数组
        // this.fileList.push(obj);
        // // 添加入路径数组
        // // this.pathList.push(res.data.fileUrl)
        // // 路径合集字符串用逗号隔开

        // // this.allUrlString = this.pathList.join(',')
        // this.allUrlString = res.data.fileUrl;
        // const data = {
        //   fileLsit: this.fileList,
        //   pathList: this.pathList,
        //   allUrlString: this.allUrlString
        // };
        // this.$emit("upload_over", data);
        this.$emit('onsuccess', res.data.fileUrl)
      } else {
        this.$message.error('上传图片失败')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.video-avatar {
  width: 148px;
  height: 148px;
  // background: #FBFDFF;
  // border: 1px dashed #c0ccda;
  // border-radius: 6px;
}
</style>
