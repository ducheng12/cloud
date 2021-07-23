<template>
  <!-- v-if="total > 10" -->
  <div class="pagination">
    <!-- :hide-on-single-page="true"  只有1页的时候分页是否隐藏 -->
    <el-pagination
      :page-sizes="pageSizesArr"
      :total="total"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      align="right"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    // 总页数
    total: {
      type: Number,
      default: 0
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页显示条数
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizesArr: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return {
      page: {
        _pageSize: this.pageSize,
        _currentPage: this.currentPage
      }
    }
  },
  methods: {
    //  每页查看条数变化
    handleSizeChange(val) {
      this.page._pageSize = val
      this.$emit('pageSizeChange', this.page)
    },
    // 当前页码变化
    handleCurrentChange(val) {
      this.page._currentPage = val
      this.$emit('pageCurrentChange', this.page)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #fff; //修改后的背景图颜色
  border: 1px solid #1890ff;
  color: #1890ff;
}
.pagination {
  padding: 24px 10px;
  // text-align: left;
  overflow: hidden;
}
</style>
