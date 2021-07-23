<template>
  <div class="picture-upload" @click="handleClick">
    <el-upload
      class="avatar-uploader"
      action="123"
      :show-file-list="false"
      :http-request="handleUploader"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleUploader(val) {
      this.$emit('on-upload', val)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleClick() {
      this.$emit('handle-click')
    }
  }
}
</script>
<style scoped>
.picture-upload >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.picture-upload >>> .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
