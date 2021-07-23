<template>
  <div>
    <el-dialog
      :visible.sync="dialogObj.DialogType"
      :close-on-click-modal="false"
      :width="dialogObj.width"
      @closed="closeIcon"
    >
      <span slot="title">{{ dialogObj.title }}</span>
      <div>
        <slot name="center" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm"> 确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialogObj: Object
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
  // 生命周期-创建完成（可以访问当前this实例）
  created() {},
  // 生命周期-挂载完成（可以访问DOM元素）
  mounted() {},
  methods: {
    cancel() {
      let { DialogType } = this.dialogObj
      DialogType = false
      this.$emit('cancel', DialogType)
    },
    confirm() {
      let { DialogType } = this.dialogObj
      DialogType = false
      this.$emit('confirm', DialogType)
    },
    // 点击x关闭
    closeIcon() {
      let { DialogType } = this.dialogObj
      DialogType = false
      this.$emit('closeIcon', DialogType)
    }
  }
}
</script>
<style scoped>
::v-deep .el-dialog__body {
  padding: 30px 20px;
  border: 1px solid #eee;
}
::v-deep .el-form-item {
  /* margin-bottom: 0px !important; */
}
::v-deep .el-dialog__header {
  padding: 20px;
}
</style>
