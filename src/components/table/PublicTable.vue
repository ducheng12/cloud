* @Descripttion: Element Ui Table 表格二次封装
<template>
  <div class="public-table">
    <el-table
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      ref="dataTable"
      :data="tableData"
      style="width: 100%"
      size="mini"
      stripe
      :height="height"
      highlight-current-row
      @selection-change="selectLine"
    >
      <!-- 多选框 -->
      <el-table-column
        v-if="objDeploy.selection"
        type="selection"
        width="55"
        :align="align"
      ></el-table-column>
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="50"
      ></el-table-column>
      <!-- 文本数据渲染 -->
      <template v-for="item in tableHead">
        <el-table-column
          v-if="item.columnType === 'slot'"
          :prop="item.field"
          :label="item.label"
          :key="item.field"
          :width="item.width"
          :align="align"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.field"
          :label="item.label"
          :key="item.field"
          :width="item.width"
          :align="align"
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "e-table",
  components: {},
  props: {
    tableHeadConfig: {
      //父组件传给子组件的表格标题
      type: Array,
      default: () => {
        return [
          {
            label: "skuId",
            field: "skuId"
          },
          {
            label: "商品名称",
            field: "skuName"
          },
          {
            label: "缩略图",
            columnType: "slot",
            slotName: "thumbnail"
          },
          {
            label: "库存数量",
            field: "onStockNum"
          },
          {
            label: "码类型",
            field: "hasUniCode"
          },
          {
            label: "状态",
            field: "status",
            columnType: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ];
      }
    },
    tableLoadData: {
      //父组件传给子组件的表格数据
      type: Array,
      default: () => {
        return [
          {
            skuId: "111",
            skuName: "222"
          }
        ];
      }
    },
    align: {
      type: String,
      default: "center"
    },
    objDeploy: {
      type: Object
    },
    height: {
      type: [Number, String]
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    indexMethod(index) {
      // 序号
      return (this.objDeploy.pageNum - 1) * this.objDeploy.pageSize + index + 1;
    },
    selectLine() {
      if (
        this.$refs.dataTable.selection &&
        this.$refs.dataTable.selection.length > 0
      ) {
        this.$emit("selectLine", this.$refs.dataTable.selection);
      }
    }
  },
  computed: {
    tableData() {
      // 表格数据
      return this.tableLoadData;
    },
    tableHead() {
      // 表格标题
      return this.tableHeadConfig;
    }
  }
};
</script>
<style lang="scss" scope>
  ::v-deep .el-table__header th {
    font-size: 14px !important;
    color: #000000;
    font-weight: bold;
    background: rgba(0,0,0,0.02)
}
.el-table--mini td, .el-table--mini th{
  padding: 12px 0 !important;
}
.el-table--mini, .el-table--small, .el-table__expand-icon{
  font-size: 14px !important;
}
</style>
