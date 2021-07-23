<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      cachedViews: ['GoodsList']
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 82px);
  /*width: 100%;*/
  width: calc(100% - 16px);
  position: relative;
  overflow: hidden;
  /*background: #FFFFFF;*/
}
.fixed-header+.app-main {
  /*padding-top: 50px;*/
  margin-top: 82px;
  background: #FFFFFF;
  border-radius: 8px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
