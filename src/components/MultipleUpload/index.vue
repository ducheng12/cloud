<!-- 多图片上传 -->
<template>
  <div class="uploader">
    <vuedraggable v-model="fileList">
      <transition-group>
        <div v-for="item in fileList" :key="item.fileUrl" class="image-item">
          <img :src="item.fullImgUrl">
          <div class="cover-view">
            <i class="el-icon-zoom-in" @click="handlePictureCardPreview(item)"></i>
            <i class="el-icon-delete" @click="handleRemove(item)"></i>
          </div>
          <span class="img-name">{{ item.name }}</span>
        </div>
      </transition-group>
    </vuedraggable>
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
import vuedraggable from 'vuedraggable'
export default {
  components: { vuedraggable },
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
          const list = vm.imageList.map((fileUrl, index) => {
            const img = {
              fullImgUrl: api + '/' + fileUrl,
              fileUrl: fileUrl,
              name: index + 1
            }
            return img
          })
          vm.fileList = JSON.parse(JSON.stringify(list))
        }
      },
      immediate: true
    }
  },
  updated() {
    const vm = this
    vm.$emit('handle-upload', vm.fileList)
  },
  mounted() {
    //
  },
  methods: {
    // 图片上传
    async handleUploader(val) {
      const vm = this
      const { file } = val
      const formData = new FormData()
      formData.append('file', val.file)
      formData.append('path', 1)
      formData.append('useDay', 1)
      const url = '/file/uploadFile'
      await Basic.upLoad(url, formData).then(res => {
        const { data } = res
        const { ip, fileUrl } = data
        const img = {
          fullImgUrl: ip + '/' + fileUrl,
          fileUrl,
          name: file.name
        }
        vm.fileList.push(img)
        vm.$message({ message: `上传图片成功！`, type: 'success' })
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
  height: 170px;
  margin: 0 8px 8px 0;
  overflow: hidden;
  background-color: #ffffff;
  position: relative;
  transition: all .5s cubic-bezier(.55,0,.1,1);
  img {
    display: block;
    width: 100%;
    height: 146px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
    object-fit: cover;
  }
  .img-name {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 24px;
    text-align: center;
    color: #000;
  }
  .cover-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 146px;
    border-radius: 6px;
    background: rgba(0, 0, 0, .5);
    opacity: 0;
    transition: opacity .3s;
    line-height: 146px;
    text-align: center;
    color: #ffffff;
    font-size: 20px;
    cursor: move;
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
