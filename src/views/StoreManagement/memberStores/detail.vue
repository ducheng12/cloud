<!--会员详情  -->
<template>
  <div class="detail-contont">
    <!-- 返回上一页 -->
    <el-page-header class="back" @back="goBack"></el-page-header>
    <el-divider></el-divider>
    <!-- 基本信息 -->
    <div class="Basic">
      <div class="title">基本信息</div>
      <div class="basic-box">
        <div class="basic-contont">
          <div class="basic-img">
            <img v-if="vipDetailData.headUrl" :src="imgObs+'/'+ vipDetailData.headUrl" />
            <img v-else src="@/assets/avatar.png" />
          </div>
          <div class="vip-phone">
            <div class="vip-name">
              <span>会员昵称：</span><span class="name">{{ vipDetailData.nickname || '--' }}</span>
            </div>
            <div>
              <span>手机号码：</span><span class="name">{{ vipDetailData.telephone || '--' }}</span>
            </div>
          </div>
        </div>
        <div class="register-contont">
          <div class="register-fert">
            <div class="register-wap"><span>真实姓名：</span><span class="name">{{ vipDetailData.realName }}</span></div>
            <!-- <div><span>注册来源：</span><span class="name">{{ vipDetailData.source | orderSourceFilter }}</span></div> -->
          </div>
          <div>
            <div class="register-wap"><span>注册时间：</span><span class="name">{{ vipDetailData.createTime }}</span></div>
            <div>
              <span>归属门店：</span>
              <span v-if="vipDetailData.vestShop" class="name">{{ vipDetailData.vestShop }}</span>
              <span style="margin-left: 16px;">
                <span>
                  <el-link type="primary" :underline="false" @click="addStor">更改</el-link>
                  <i class="el-icon-minus icons"></i>
                  <el-link type="primary" :underline="false" @click="changeRecord">更换记录</el-link></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 标签信息 -->
    <!-- <div class="detail-tag">
      <div class="tag-title">标签信息</div>
      <div class=" messages">
        <div v-if="vipDetailData.tagNameList">
          <el-tag v-for="item in vipDetailData.tagNameList" :key="item.id" type="info" effect="plain" style="margin: 0 5px 5px 0">{{ item.name }}</el-tag>
        </div>
        <div v-else>暂无信息</div>
      </div>
    </div> -->
    <!-- 会员等级 -->
    <!-- <div class="detail-tag">
      <div class="tag-title">会员等级及权益</div>
      <div class=" messages">
        <div v-if="vipDetailData.level">{{ vipDetailData.level }}</div>
        <div v-else>暂无会员等级</div>
      </div>
    </div> -->
    <!-- 交易统计 -->
    <div class="detail-tag">
      <div class="tag-title">交易统计</div>
      <div class=" messages">
        <div class="deal">
          <div>
            <span class="deal-name">累计消费金额：</span><span style="color: #ff4d4f;">￥ {{ vipDetailData.countConsume || 0 }}</span>
          </div>
          <div class="deal-num">
            <span class="deal-name">累计完整订单数：</span><span>{{ vipDetailData.fullOrders || 0 }}</span>
          </div>
          <div>
            <span class="deal-name">最近下单时间：</span><span>{{ vipDetailData.purchaseTime || '--' }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加的弹窗 -->
    <public-dialog
      :title="'选择门店'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <!-- 头部搜索 -->
      <div class="dialog-header">
        <el-button size="mini" icon="el-icon-refresh-right" @click="refresh">刷新</el-button>
        <div style="width:160px;">
          <el-input v-model="formData.name" placeholder="请输入内容" size="mini">
            <i slot="suffix" class="el-icon-search" style="font-style:normal;margin-right: 10px;line-height: 32px;"></i>
          </el-input>
        </div>
      </div>
      <!-- 列表 -->
      <public-table :show-index="false" :table-head="tableHead" :table-data="tableData">
        <template slot="handle" slot-scope="slotProps">
          <!-- <el-radio-group v-model="radios" @change="changeRadio(slotProps.data.id)"> -->
          <el-radio v-model="radios" :label="slotProps.data.id" @change="changeRadio(slotProps.data.id)">{{ slotProps.data.name }}</el-radio>
          <!-- </el-radio-group> -->
        </template>
      </public-table>
      <!-- 分页 -->
      <Pagination
        ref="myPagination"
        :sum-total="sumTotal"
        @handle-size="handlePageSize"
        @handle-current="handlePageCurrent"
      />
      <template v-slot:footer>
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="addVipSpoh">保 存</el-button>
      </template>
    </public-dialog>
    <!-- 更换记录 -->
    <public-dialog
      :title="'更换记录'"
      :visible="changeStatus"
      :custom-class="'filter-view'"
      @handle-cancel="changeStatus = false"
      @after-close="changeStatus = false"
    >
      <public-table :show-index="false" :table-head="changeTableHead" :table-data="changeTableData"></public-table>
      <Pagination
        :sum-total="changeTotal"
        @handle-size="changePageSize"
        @handle-current="changePageCurrent"
      />
      <template v-slot:footer>
        <el-button size="small" @click="changeStatus = false">取 消</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="changeStatus = false">保 存</el-button>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import { infoList } from '@/api/members'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import PublicDialog from '@/components/Dialog/PublicDialog'
import { Basic } from '@/api/base'
export default {
  components: { PublicTable, Pagination, PublicDialog },
  filters: {
    orderSourceFilter(source) {
      switch (source) {
        case 1:
          return '懂衣小程序'

        case 2:
          return 'app'

        case 3:
          return 'PC'

        default:
          return '----'
      }
    }
  },
  data() {
    return {
      timeout: '', // 防抖的时间
      listId: {
        shopId: '', // 门店id
        id: '' // 会员id
      },
      changeStatus: false, // 更换弹窗的开关
      radios: '',
      changeTotal: 0, // 更换弹窗里的总数
      sumTotal: 0,
      formData: { // 门店参数
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      changeData: {
        pageNum: 1,
        pageSize: 10
      },
      changeTableData: [], // 更换记录的数据
      changeTableHead: [ // 更换记录的头部标题
        { label: '更新时间', value: 'createTime' },
        { label: '门店变更', value: 'shopName' },
        { label: '操作人', value: 'updateName' }
      ],
      tableHead: [ // 添加店铺的头部标题
        { label: '店铺信息', type: 'slot', slotName: 'handle' }
      ],
      tableData: [],
      keyName: '',
      filterView: false, // 添加门店的弹窗开关
      imgObs: process.env.VUE_APP_FILE_URL_OBS,
      vipDetailData: {} // 详情数据

    }
  },
  computed: {},
  watch: {
    'formData.name': {
      // 防抖
      handler(newName, oldName) {
        clearTimeout(this.timeout)
        if (this.formData.name !== '') {
          this.$refs.myPagination.currentPage = 1
        }
        this.formData.pageNum = 1
        this.timeout = setTimeout(() => {
          this.getShop()
        }, 500)
      },
      immediate: true
      // deep:true
    }
  },

  created() {
    this.gitVipDetail()
    this.getShop()
  },
  mounted() {},

  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 刷新
    refresh() {
      const vm = this
      vm.formData.pageNum = 1
      console.log(vm.$refs.myPagination.currentPage)
      vm.$refs.myPagination.currentPage = vm.formData.pageNum
      vm.formData.name = ''
      vm.radios = ''
      vm.listId.shopId = ''
      vm.getShop()
    },
    // 更换记录里的事件
    changeRecord() {
      const vm = this
      vm.changeData.id = vm.listId.id
      vm.changeStatus = true
      Basic.general('member/changeShopList', vm.changeData).then(res => {
        vm.changeTableData = res.data.records
        vm.changeTotal = res.data.total
      })
    },
    // 更换记录里的分页
    changePageSize(val) {
      this.changeData.pageSize = val
      this.changeRecord()
    },
    changePageCurrent(val) {
      this.changeData.pageNum = val
      this.changeRecord()
    },
    // 保存
    addVipSpoh() {
      const vm = this
      if (vm.listId.shopId === '') {
        vm.$message({ message: '提请选择门店!', type: 'warning' })
        return
      }
      Basic.normal('member/changeVestShop', vm.listId).then(res => {
        vm.$message({ message: '保存成功！', type: 'success' })
        this.filterView = false
        vm.gitVipDetail()
      })
    },
    // 单选框事件
    changeRadio(id) {
      const vm = this
      vm.listId.shopId = id
    },
    // 取消关闭弹窗
    closeDialog() {
      this.filterView = false
    },
    // 清空弹窗
    afterClosed() {
      this.handleReset()
      this.filterView = false
    },
    handleReset() {
      // this.$refs['filterForm'].resetFields()
    },
    // 关闭弹窗
    handleCancel() {
      this.filterView = false
    },
    // 分页
    handlePageSize(val) {
      this.formData.pageSize = val
      this.getShop()
    },
    handlePageCurrent(val) {
      this.formData.pageNum = val
      this.getShop()
    },
    // 获取门店数据
    getShop() {
      const vm = this
      Basic.list('shop', vm.formData).then(res => {
        vm.tableData = res.data.records
        vm.sumTotal = res.data.total
      })
    },
    // 添加门店
    addStor() {
      const vm = this
      vm.filterView = true
      vm.formData.name = ''
      vm.refresh()
      vm.getShop()
    },
    // 获取会员详情
    gitVipDetail() {
      const vm = this
      infoList({ id: vm.$route.query.orderId }).then(res => {
        vm.vipDetailData = res.data
        vm.listId.id = res.data.id
        // vm.stingTag = vm.vipDetailData.tagNameList.map(item => item.name).join(',')
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.el-link{
  font-size: 16px !important;
  font-weight: 400 !important;
  text-decoration: none !important;
}
  .detail-contont{
    padding: 24px;
    font-size: 20px;
    font-weight: 500;
    .title{
      padding-bottom: 24px;
    }
    .Basic{
      display: flex;
      .title{
        padding-right: 24px;
      }
      .basic-box{
        font-size: 16px;
        color: rgba(0,0,0,0.85);
        font-weight: 400;
        .basic-contont{
          display: flex;
          align-items: center;
          .basic-img{
            width: 88px;
            height: 88px;
            margin-right: 16px;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .vip-phone{
            .name{
              color: rgba(0,0,0,0.45);
            }
            .vip-name{
              padding-bottom: 8px;
            }
          }
        }
        .register-contont{
          display: flex;
          .register-fert{
            margin-right: 32px;
          }
          .name{
              color: rgba(0,0,0,0.45);
            }
          .spaced{
            padding: 16px 0;
          }
          .register-wap{
            padding: 16px 0;
          }
          .icons{
            transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            /* Internet Explorer 9*/
            -moz-transform: rotate(90deg);
            /* Firefox */
            -webkit-transform: rotate(90deg);
            /* Safari 和 Chrome */
            -o-transform: rotate(90deg);
          }
        }
      }
    }
    // 标签样式
  .detail-tag{
    padding-top: 24px;
    display: flex;
    // align-items: center;
    .tag-title{
      padding-right: 24px;
    }
    .messages{
      width: 50%;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0,0,0,0.45);
      line-height: 24px;
    }
  }

  .deal{
    display: flex;
    .deal-num{
      padding: 0 24px;
    }
    .deal-name{
      color: rgba(0,0,0,0.85);
    }
  }
  }
  // 弹窗样式
/deep/ .filter-view {
  width: 691px !important;
}
.dialog-header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.back /deep/ .el-page-header__title{
  font-size: 20px;
}
/deep/ .el-page-header__left::after {
  width: 0;
}
</style>
