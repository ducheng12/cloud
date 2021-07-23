<template>
  <div class="public-dialog">
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      :before-close="handleCancel"
      :custom-class="customClass"
      @closed="afterClose"
    >
      <slot></slot>
      <div slot="footer" class="dialog-footer">
        <slot name="footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible: function() {
      this.dialogVisible = this.visible
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('handle-cancel')
    },

    afterClose() {
      this.$emit('after-close')
    }
  }
}
</script>

<style lang='scss' scoped>
.public-dialog /deep/ .el-dialog {
  width: 45%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  transform: translate(-50%, -50%);
}

.public-dialog /deep/ .el-dialog__header {
  font-size: 16px;
  color: #000;
  font-weight: bold;
  box-sizing: border-box;
  line-height: 55px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
}

.public-dialog /deep/ .el-dialog__body {
  padding: 24px;
}

.public-dialog /deep/ .el-dialog__footer {
  box-sizing: border-box;
  line-height: 51px;
  padding: 0 24px;
  border-top: 1px solid rgba(0, 0, 0, .06);
}
</style>
