<!--查询表单组件验证   -->
<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="searchModel"
    size="small"
    :label-width="labelWidth"
    class="search-bar"
    @submit.native.prevent
  >
    <el-form-item
      v-for="(item, index) in formOptions"
      :key="index"
      :label-width="item.width"
      :label="item.label"
      :prop="item.prop"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="searchModel[item.prop]"
        :placeholder="item.placeholder"
        style="width: 150px;"
        clearable
        @clear="handleQuery"
      />
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="searchModel[item.prop]"
        :picker-options="item.pickerOptions ? item.pickerOptions : {}"
        style="width: 150px;"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-select
        v-if="item.type === 'initSelect'"
        v-model.trim="searchModel[item.prop]"
        :placeholder="item.placeholder"
        clearable
        filterable
        style="width: 150px;"
        @change="initSelectChange"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-select
        v-if="item.type === 'select'"
        v-model.trim="searchModel[item.prop]"
        :placeholder="item.placeholder"
        filterable
        clearable
        style="width: 150px;"
        @change="selectChange"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-cascader
        v-if="item.type === 'cascader'"
        v-model="searchModel[item.prop]"
        :placeholder="item.placeholder"
        :options="item.list"
        :props="{ multiple: item.multiple || false, checkStrictly: true }"
        clearable
      />
    </el-form-item>
    <el-form-item v-if="btnItems.btnQuery.type" label-width="0px">
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleQuery"
      >{{ btnItems.btnQuery.name }}</el-button>
    </el-form-item>
    <el-form-item v-if="btnItems.btnRese.type" label-width="0px">
      <el-button
        type="default"
        style="margin-right: 20px"
        @click="onReset"
      >{{ btnItems.btnRese.name }}</el-button>
    </el-form-item>
    <el-form-item v-if="btnItems.btnExport.type" label-width="0px">
      <el-button
        type="default"
        icon="el-icon-upload2"
        @click="handleExport"
      >{{ btnItems.btnExport.name }}</el-button>
    </el-form-item>
    <el-form-item v-if="btnItems.btnAdd.type" label-width="0px">
      <el-button type="default" @click="handlePush">{{
        btnItems.btnAdd.name
      }}</el-button>
    </el-form-item>
    <el-form-item v-if="btnItems.btnImpo.type" label-width="0px">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :http-request="handleImpor"
        :show-file-list="false"
      >
        <el-button
          slot="trigger"
          size="small"
          plain
        >{{ btnItems.btnImpo.name }}</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item v-if="btnItems.btnDown.type" label-width="0px">
      <a :href="downUrl">
        <el-button type="default" @click="handleDown">{{
          btnItems.btnDown.name
        }}</el-button>
      </a>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: String,
      default: '60px'
    },
    formOptions: {
      type: Array,
      required: true
    },
    btnItems: {
      type: Object,
      required: true
    },
    downUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchModel: {}
    }
  },
  methods: {
    initSelectChange(val) {
      this.$emit('initSelect-change', val)
    },
    // 下拉框change事件
    selectChange(val) {
      this.$emit('select-change', val)
    },
    // 查询
    handleQuery() {
      this.$emit('handle-query', this.searchModel)
    },
    // 重置
    onReset() {
      this.$refs.formRef.resetFields()
      this.searchModel = {}
      this.$emit('handle-delete')
    },
    // 新增
    handlePush() {
      this.$emit('handle-push')
    },
    // 导出
    handleExport() {
      this.$emit('handle-export', this.searchModel)
    },

    // 导入
    handleImpor(val) {
      this.$emit('handle-impor', val)
    },
    // 下载
    handleDown() {
      this.$emit('handle-down')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  padding-bottom: 10px;
  width: 100%;
  overflow: hidden;
}
.search-bar >>> .el-form-item {
  margin-bottom: 10px;
}
::v-deep .el-form-item__label {
  //表单label样式
  width: 85px !important;
}
.search-bar >>> .el-range-separator {
  padding: 0;
}
.search-bar .el-button {
  //按钮样式
  padding: 8px 20px !important;
}
</style>
