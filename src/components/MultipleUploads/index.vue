<!-- 多图片上传 -->
<template>
  <div class="uploader">
    <div v-for="item in fileList" :key="item.fileUrl" class="image-item">
      <img :src="item.fullImgUrl">
      <div class="cover-view">
        <i class="el-icon-zoom-in" @click="handlePictureCardPreview(item)"></i>
        <i class="el-icon-delete" @click="handleRemove(item)"></i>
      </div>
    </div>
    <el-upload
      v-if="fileList.length < limit"
      class="avatar-uploader"
      action="#"
      multiple
      :show-file-list="false"
      :http-request="handleUploader"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import { Basic } from '@/api/base'
// import vuedraggable from 'vuedraggable'
export default {
  components: { },
  props: {
    imageList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {},
  watch: {
    imageList: {
      handler: function() {
        const vm = this
        if (vm.imageList.length) {
          const api = process.env.VUE_APP_FILE_URL_OBS
          const list = vm.imageList.map(fileUrl => {
            const img = {
              fullImgUrl: api + '/' + fileUrl,
              fileUrl: fileUrl
            }
            return img
          })
          vm.fileList = JSON.parse(JSON.stringify(list))
        }
      },
      immediate: true
    }
  },
  methods: {
    // 图片上传
    handleUploader(val) {
      const vm = this
      const formData = new FormData()
      formData.append('file', val.file)
      formData.append('path', 1)
      formData.append('useDay', 1)
      const url = '/file/uploadFile'
      Basic.upLoad(url, formData).then(res => {
        const { data } = res
        const { ip, fileUrl } = data
        const img = {
          fullImgUrl: ip + '/' + fileUrl,
          fileUrl
        }
        vm.fileList.push(img)
        vm.$message({ message: `上传图片成功！`, type: 'success' })
        vm.$emit('handle-upload', vm.fileList)
      }).then(() => {
        if (vm.fileList.length > vm.limit) {
          vm.$message.error(`图片最多只允许上传${vm.limit}张！`)
        }
      })
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
    // 查看大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.fullImgUrl
      this.dialogVisible = true
    },
    // 删除图片
    handleRemove(file) {
      const vm = this
      const list = vm.fileList.filter(t => t.fileUrl !== file.fileUrl)
      vm.fileList = JSON.parse(JSON.stringify(list))
      vm.$emit('handle-upload', vm.fileList)
    }
  }
}

</script>
<style lang='scss' scoped>
.uploader {
  overflow: hidden;
}

.uploader .image-item {
  float: left;
  width: 146px;
  height: 146px;
  background: #ccc;
  margin: 0 8px 8px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #c0ccda;
  background-color: #ffffff;
  position: relative;
  transition: all .5s cubic-bezier(.55,0,.1,1);
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .cover-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    opacity: 0;
    transition: opacity .3s;
    line-height: 146px;
    text-align: center;
    color: #ffffff;
    font-size: 20px;
    i {
      cursor: pointer;
    }
  }
  .cover-view i+i {
    margin-left: 15px;
  }
  &:hover .cover-view {
    opacity: 1;
  }
}

.uploader .avatar-uploader {
  // display: inline-block;
  float: left;
  height: 146px;
}

.uploader >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader >>> .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.uploader >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 144px;
  height: 144px;
  line-height: 144px;
  text-align: center;
}
.uploader >>> .avatar {
  width: 144px;
  height: 144px;
  display: block;
}
</style>
