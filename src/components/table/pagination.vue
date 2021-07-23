<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="objDeploy.pageNum"
      :page-sizes="[10, 50, 100, 200]"
      :page-size="objDeploy.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="objDeploy.pagecount"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    objDeploy: {
      type: Object
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('sizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    }
  }
}
</script>

<style scoped>
.pagination {
  padding:24px 0;
  text-align: left;
}
</style>
