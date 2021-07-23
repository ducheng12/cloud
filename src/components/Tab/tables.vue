<template>
  <div class="fox">
    <el-table
      ref="dataTable"
      :data="tableData"
      style="width: 100%; font-size: 14px"
      max-height="620"
      size="mini"
      stripe
      highlight-current-row
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266'
      }"
      class="my-table"
      :default-sort="{ prop: 'payTime', order: false }"
      @selection-change="selectLine()"
      @sort-change="sortChange"
    >
      <!-- 多选框 -->
      <el-table-column
        v-if="showSelect"
        type="selection"
        width="44"
        align="center"
      ></el-table-column>
      <!-- 文本数据渲染 -->
      <!-- <el-table-column type="index" :index="indexMethod"  label="序号" width="50" :align="align"></el-table-column> -->
      <template v-for="item in tableHead">
        <el-table-column
          v-if="item.columnType === 'slot'"
          :key="item.field"
          :show-overflow-tooltip="true"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          :align="align"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.field"
          :show-overflow-tooltip="true"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          :align="align"
          :sortable="item.sortable || false"
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Etable',
  components: {},
  props: {
    showSelect: {
      type: Boolean,
      default: true
    },
    sortable: {
      type: [Boolean, String],
      default: 'custom'
    },
    tableHeadConfig: {
      type: Array,
      default: () => {
        return [
          {
            label: 'skuId',
            field: 'skuId'
          },
          {
            label: '商品名称',
            field: 'skuName'
          },
          {
            label: '缩略图',
            columnType: 'slot',
            slotName: 'thumbnail'
          },
          {
            label: '缩略图',
            columnType: 'slot',
            slotName: 'goodsPhoto'
          },
          {
            label: '库存数量',
            field: 'onStockNum'
          },
          {
            label: '码类型',
            field: 'hasUniCode'
          },
          {
            label: '状态',
            field: 'status',
            columnType: 'slot',
            slotName: 'status'
          },
          {
            label: '操作',
            columnType: 'slot',
            slotName: 'operation'
          }
        ]
      }
    },
    tableLoadData: {
      type: Array,
      default: () => {
        return [
          {
            skuId: '111',
            skuName: '222'
          }
        ]
      }
    },

    align: {
      type: String,
      default: 'left'
    },
    selection: {
      type: Boolean,
      default: false
    },
    height: {
      type: [Number, String],
      default: 600
    }
  },
  data() {
    return {
      pageSize: 10
    }
  },
  computed: {
    tableData() {
      return this.tableLoadData
    },
    tableHead() {
      return this.tableHeadConfig
    }
  },
  created() {},
  mounted() {},
  methods: {
    // indexMethod(index) { // 序号
    //   //return (this.tableHead.pageNum - 1) * this.pageSize + index + 1;
    //   return index+1
    // },
    // 多選id數組
    selectLine() {
      if (this.$refs.dataTable.selection && this.$refs.dataTable.selection.length >= 0) {
        this.selectionID = this.$refs.dataTable.selection.map(item => item.orderId)
        this.$emit('selectLine', this.selectionID)
      }
    },
    // 排序
    sortChange(column) {
      this.$emit('sortChange', column)
    }
  }
}
</script>
<style lang="scss" scoped>
/* //.fox{border: 1px solid black;};
// 点击的时候添加的class样式
// .el-table__body tr.current-row > td {
//   // background-color: #69A8EA !important;
//   background-color: #1f2d3da1 !important;
//   color: #fff;
// }
// .my-table {
//   .el-table-column--selection .cell {
//     padding: 0;
//   }
// } */
/* .fox >>> .el-table-column--selection .cell {
  padding: 0 6px;
  text-align: right;
} */
.el-table .el-table-column--selection > .cell {
  padding: 0 6px;
  text-align: right;
}
.el-table__row > td {
  border: none;
}
</style>
