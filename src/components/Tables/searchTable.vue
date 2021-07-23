<template>
  <div>
    <el-form
      :model="searchModel"
      size="small"
      :inline="true"
      :label-width="labelWidth"
      class="search-bar"
      @submit.native.prevent
    >
      <el-select
        v-model="searchModel.label"
        size="small"
        clearable
        @clear="handleQuery"
      >
        <el-option
          v-for="option in optionList"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-form-item
        v-for="(item, index) in searchList"
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
        <slot />
      </el-form-item>
    </el-form>
    <div class="public-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="720"
        @selection-change="handleSelection"
      >
        <el-table-column v-if="showSelect" type="selection" width="44" fixed align="center" />
        <el-table-column v-if="showIndex" type="index" :index="indexNum" label="序号" width="55" fixed align="center" />
        <el-table-column
          v-for="(item, index) in tableHead"
          :key="index"
          :fixed="item.fixed || false"
          :label="item.label"
          :width="item.width || ''"
          :min-width="item.minWidth || ''"
          :align="item.align || 'left'"
          :sortable="item.sort || false"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.type === 'slot'">
              <slot :name="item.slotName" :data="scope.row" />
            </template>
            <template v-else>
              {{ item.prefix || '' }} {{ scope.row[item.value] }} {{ item.suffix || '' }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="sumTotal > 10" class="my-pagination">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sumTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
/**
 * @prop { Boolean } showSelect 控制表格多选框是否显示
 * @prop { Boolean } showIndex 控制表格序号列是否显示
 * @prop { Array } tableHead 表格表头配置信息
 * @prop { Array } tableData 表格数据源
 * @method handleSelection 多选表格选中操作
 * @param { Array } multipleList 多选表格选中项数据
 * @param { Boolean } fixed 固定列配置信息
 * @param { String } label 表头信息配置
 * @param { Number } width 列宽信息配置
 * @param { String } align 表格对齐方式配置
 * @param { Boolean } sort 可排序列信息配置
 * @param { String } prefix 文本单元格头部信息
 * @param { String } suffix 文本单元格尾部信息
 **/
export default {
  name: 'SearchTable',
  components: {},
  props: {
    sumTotal: {
      type: Number,
      required: true
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    tableHead: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    labelWidth: {
      type: String,
      default: '60px'
    },
    optionList: {
      type: Array,
      required: true
    },
    searchList: {
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
      default: false
    }
  },
  data() {
    return {
      searchModel: {},
      multipleList: [],
      currentPage: 1,
      pageSize: 10
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
    },
    handleSelection(val) {
      const vm = this
      vm.multipleList = val
      vm.$emit('handle-selection', vm.multipleList)
    },
    handleSizeChange(val) {
      this.$emit('handle-size', val)
    },
    handleCurrentChange(val) {
      this.$emit('handle-current', val)
    },
    indexNum(index) {
      const vm = this
      return index + 1 + ((vm.currentPage - 1) * vm.pageSize)
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
.public-table /deep/ .el-table__header th {
  font-size: 14px !important;
  color: #000000;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.02);
}

.public-table /deep/ .el-table-column--selection .cell {
  padding: 0 6px;
  text-align: right;
}

.public-table /deep/ .el-button {
  padding: 6px 0px 7px;
  font-size: 14px;
}
.my-pagination {
  padding: 24px 10px;
  text-align: right;
  overflow: hidden;
}
</style>
