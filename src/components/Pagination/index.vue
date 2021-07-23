<template>
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
</template>

<script>
export default {
  props: {
    sumTotal: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handle-size', val)
    },
    handleCurrentChange(val) {
      this.$emit('handle-current', val)
    }
  }
}
</script>

<style scoped>
.my-pagination {
  padding: 24px 10px;
  text-align: right;
  overflow: hidden;
}
</style>
