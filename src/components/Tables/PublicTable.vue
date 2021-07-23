<!-- 公共表格组件 -->
<template>
  <div class="public-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="720"
      @selection-change="handleSelection"
    >
      <el-table-column v-if="showSelect" type="selection" width="44" fixed align="center" />
      <el-table-column v-if="showIndex" type="index" label="序号" width="55" fixed align="center" />
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
  name: 'PublicTable',
  components: {},
  props: {
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
    }
  },
  data() {
    return {
      multipleList: []
    }
  },

  computed: {},

  mounted() {},

  methods: {
    handleSelection(val) {
      const vm = this
      vm.multipleList = val
      vm.$emit('handle-selection', vm.multipleList)
    }
  }
}
</script>
<style lang='scss' scoped>
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
</style>
