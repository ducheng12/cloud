<!--图片上传组件-->
<template>
  <div class="container">
    <el-upload
      :limit="limit"
      :action="uploadUrl"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleListSuccess"
      :on-exceed="exceed"
      :file-list="fileList"
      :data="data"
      :before-upload="beforeAvatarUpload"
    >
      <!-- <i class="el-icon-plus" /> -->
      <div style="font-size:16px;color: #7F7F7F;">图片上传</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
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
      type: Array,
      default: []
    }
  },
  data() {
    return {
      imgGoodsList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: `${process.env.VUE_APP_FILE_URL}/file/uploadFile`,
      data: {
        useDay: 1,
        path: 1
      },
      fileList: [],
      pathList: [],
      allUrlString: '',
      imgIp: this.proce
    }
  },
  watch: {
    url(val) {
      this.fileList = []
      if (!val) return
      for (let i = 0; i < val.length; i++) {
        let obj = {}
        obj = {
          name: '图片',
          url: `${process.env.VUE_APP_FILE_URL_OBS}/` + val[i],
          urls: val[i]
        }
        // this.fileList = []
        this.fileList.push(obj)
      }
    }
  },
  methods: {
    exceed(val, list) {
      this.$message.warning('只能上传' + list.length + '张图片!')
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传商品图片大小不能超过 1MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 清空图片数组
    handleRemoveempty() {
      this.fileList = []
    },
    handleRemove(file, fileList) {
      // 重置预览数据
      // this.fileList = fileList
      // // 删除路径数组内对应的元素
      // for (const index in this.pathList) {
      //   if (`${process.env.VUE_APP_FILE_URL_OBS}/${this.pathList[index]}` === file.url) {
      //     this.pathList.splice(index, 1)
      //   }
      // }
      // // 重置路径合集字符串
      // this.allUrlString = this.pathList.join(',')
      // const data = {
      //   fileLsit: this.fileList,
      //   pathList: this.pathList,
      //   allUrlString: this.allUrlString
      // }
      // this.$emit('upload_over', data)
      this.$emit('onremove', this.fileList,file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleListSuccess(res, file) {
      if (res.code === 200) {
        const obj = {
          name: '图片',
          url: res.data.ip + '/' + res.data.fileUrl,
          urls: res.data.fileUrl
        }
        // 添加入预览数组
        this.imgGoodsList.push(obj)
        // 添加入路径数组
        // this.pathList.push(res.data.fileUrl)
        // 路径合集字符串用逗号隔开

        // this.allUrlString = this.pathList.join(',')
        this.allUrlString = res.data.fileUrl
        const data = {
          fileLsit: this.fileList,
          pathList: this.pathList,
          allUrlString: this.allUrlString
        }
        this.$emit('upload_over', data)
        this.$emit('onsuccess', this.imgGoodsList)
        this.$message({ message: '上传图片成功', type: 'success'});
      } else {
        this.$message.error('上传图片失败')
      }
    }
  }
}
</script>
