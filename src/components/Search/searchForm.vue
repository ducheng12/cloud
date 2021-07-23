<template>
  <el-form
    ref="searchModel"
    :model="searchModel"
    size="small"
    :inline="true"
    :label-width="labelWidth"
    class="search-bar"
    @submit.native.prevent
  >
    <el-form-item
      v-for="(item, index) in optionList"
      :key="index"
      :label-width="item.width"
      :label="item.label"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="searchModel[item.key]"
        :placeholder="item.placeholder"
        clearable
        @clear="handleQuery"
      />
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="searchModel[item.key]"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        :placeholder="item.placeholder"
      >
      </el-date-picker>
      <el-date-picker
        v-if="item.type === 'date2'"
        v-model="searchModel[item.key]"
        :picker-options="item.pickerOptions ? item.pickerOptions : {}"
        type="daterange"
        :unlink-panels="true"
        range-separator="至"
        :start-placeholder="item.placeholder + '开始时间'"
        :end-placeholder="item.placeholder + '结束时间'"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <el-select
        v-if="item.type === 'select'"
        v-model="searchModel[item.key]"
        :placeholder="item.placeholder"
        clearable
        @clear="handleQuery"
      >
        <el-option
          v-for="option in item.list"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <!--多选 -->
      <el-select
        v-if="item.type === 'select2'"
        v-model="searchModel[item.key]"
        multiple
        :placeholder="item.placeholder"
        clearable
        @clear="handleQuery"
      >
        <el-option
          v-for="option in item.list"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-cascader
        v-if="item.type === 'cascader'"
        v-model="searchModel[item.key]"
        :placeholder="item.placeholder"
        :options="item.list"
        :props="{ multiple: item.multiple || false, checkStrictly: true }"
        clearable
      />
    </el-form-item>
    <slot name="condition" :data="searchModel"></slot>
    <el-form-item>
      <el-button
        v-if="isSearch"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handleQuery"
      >
        查询
      </el-button>
      <el-button
        v-if="isClear"
        icon="el-icon-refresh-right"
        size="small"
        @click="handleClear('searchModel')"
      >
        重置
      </el-button>
      <el-button v-if="isAdd" type="primary" icon="el-icon-edit" size="small" @click="handlePush">
        新增
      </el-button>
      <el-button
        v-if="isExport"
        type="primary"
        icon="el-icon-download"
        size="small"
        @click="handleExport"
      >导出</el-button>
      <el-button
        v-if="isImpor"
        type="primary"
        icon="el-icon-upload2"
        size="small"
        @click="handleImpor"
      >导入</el-button>
      <!-- <el-button icon="el-icon-s-flag" @click="dialogTableVisible" size="small" type="text">高级筛选</el-button> -->
      <slot />
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
    optionList: {
      type: Array,
      required: true
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    isImpor: {
      type: Boolean,
      default: false
    },
    isExport: {
      type: Boolean,
      default: false
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    isClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchModel: {}
    }
  },
  methods: {
    // 查询
    handleQuery() {
      this.$emit('handle-query', this.searchModel)
    },
    // 重置
    handleClear(searchModel) {
      this.searchModel = {}
      this.$refs[searchModel].resetFields()
      this.$emit('handle-clear')
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
    handleImpor() {
      this.$emit('handle-impor')
    }
  }
}
</script>

<style scoped>
.search-bar {
  /* width: 100%; */
  overflow: hidden;
}
.search-bar >>> .el-form-item {
  margin-bottom: 10px;
}
.search-bar >>> .el-range-separator {
  padding: 0;
}
</style>
