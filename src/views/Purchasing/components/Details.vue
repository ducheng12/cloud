<template>
  <div class="detailBox">
    <el-page-header class="page-header" @back="goBack"></el-page-header>
    <div class="leftData">
      <div class="nav">
        <div class="nav_top">
          <div class="nav_div1">采购单编号：{{ orderDetails.orderId || '--' }}</div>
          <div style="clear: both"></div>
        </div>
        <div class="nav_bottom">
          <div class="Basiclist">
            <span>门店： {{ orderDetails.storeName || '--' }}</span>
            <span>供应商：{{ orderDetails.supplierName || '--' }}</span>
            <span>付款时间：{{ orderDetails.payTime || '--' }}</span>
            <span>支付方式：{{ orderDetails.payMethod | payMethodFilter }}</span>
            <span>物流公司：{{ orderDetails.logisticsCompany === 'NONE' ? '--' : orderDetails.logisticsCompany }}</span>
            <span>运单号：{{ waybillNumber || '--' }}</span>
            <span>门店备注：{{ orderDetails.remark || '--' }}</span>
            <span>供应商备注：{{ orderDetails.supplierRemark || '--' }}</span>
          </div>
          <div class="statusMoney">
            <div class="ddzt">
              <p>采购单状态</p>
              <div class="status">
                <span class="status-color" :style="{ background:statusColor }"></span>
                {{ orderDetails.orderStatusValue || '--' }}
              </div>
            </div>
            <div class="ddje">
              <p>应付金额</p>
              <span>￥{{ orderDetails.payable || '0.00' }}</span>
              <p>服务费</p>
              <span>￥{{ orderDetails.serviceMoney || '0.00' }}</span>
            </div>
            <div class="ddje">
              <p>采购单总金额</p>
              <span>￥{{ orderDetails.purchaseGoodsMoney || '0.00' }}</span>
              <p>运费</p>
              <span>￥{{ orderDetails.expressCharge || '0.00' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="progressBox">
        <div class="inner">
          <el-steps :active="statusActive" process-status="success" align-center finish-status="success">
            <el-step
              v-for="item in statusTime"
              :title="item.title"
              :description="item.time"
            ></el-step>
          </el-steps>
        </div>
      </div>
      <div class="tableContent">
        <el-button
          v-show=" tabsIndex === 2 "
          class="expBtn"
          type="primary"
          icon="el-icon-download"
          size="small"
          @click="handleExport"
        >
          导出数据
        </el-button>
        <div class="tableHeader">
          <div
            v-for="(item, index) in tabsList"
            :key="item + index"
            class="name"
            style="width:80px;margin-right:0;padding-right:0;"
            :class="{ tabActive: index == tabsIndex }"
            @click="changeTabs(index)"
          >
            {{ item }}
          </div>
        </div>
        <!-- 采购单详情 -->
        <div v-show="tabsIndex === 0">
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>采购单信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">采购单编号</div>
              <div class="div">付款时间</div>
              <div class="div">采购单状态</div>
              <div class="div">支付方式</div>
            </div>
            <div class="NewsList">
              <div>{{ orderDetails.orderId || '--' }}</div>
              <div>{{ orderDetails.payTime || '--' }}</div>
              <div class="status">
                <span class="status-color status-colors" :style="{ background:statusColor }"></span>
                {{ orderDetails.orderStatusValue ||'--' }}
              </div>
              <div>
                {{ orderDetails.payMethod | payMethodFilter }}
              </div>
            </div>
            <div class="NewsList">
              <div class="div">门店</div>
              <div class="div">供应商</div>
            </div>
            <div class="NewsList">
              <div>
                {{ orderDetails.storeName }}
              </div>
              <div>{{ orderDetails.supplierName }}</div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>收货人信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">收货人</div>
              <div class="div">手机号码</div>
              <div class="div">邮政编码</div>
              <div class="div">收货地址</div>
            </div>
            <div class="NewsList">
              <div>{{ orderDetails.name || '--' }}</div>
              <div>{{ orderDetails.telephone || '--' }}</div>
              <div>{{ orderDetails.zipCode|| '--' }}</div>
              <div>{{ orderDetails.address || '--' }}</div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>物流信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">物流公司</div>
              <div class="div">运单号</div>
              <div class="div">收货时间</div>
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <span style="width:25%;display:inline-block;margin-left:20px;">{{ orderDetails.logisticsCompany === 'NONE' ? '--' : orderDetails.logisticsCompany }}</span>
              <span style="width:25%;display:inline-block;">{{ orderDetails.waybillNumber || '--' }}</span>
              <span>{{ orderDetails.receiptTime ||'--' }}</span>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>支付信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">采购单金额</div>
              <div class="div">服务费</div>
              <div class="div">合计</div>
              <div class="div">付款金额</div>
              <div class="div">支付方式</div>
            </div>
            <div class="NewsList">
              <div>￥{{ orderDetails.purchaseGoodsMoney || '0.00' }}</div>
              <div>￥{{ orderDetails.serviceMoney || '0.00' }}</div>
              <div>￥{{ orderDetails.payable || '0.00' }}</div>
              <div>￥{{ orderDetails.payMoney || '0.00' }}</div>
              <div>
                {{ orderDetails.payMethod | payMethodFilter }}
              </div>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <div v-show="tabsIndex === 1">
          <e-table
            class="goosList"
            style="margin-top: 30px"
            :table-head-config="tableHeadConfig"
            :table-load-data="goodsData"
            :show-select="showSelect"
          >
            <template v-slot:goodsNums="slotData">
              {{ slotData.data.row.indexNum + 1 }}
            </template>
            <template slot="goodsPrice" slot-scope="slotProps">
              ￥{{ slotProps.data.row.goodsPrice }}
            </template>
            <template slot="goodsMoney" slot-scope="slotProps">
              ￥{{ slotProps.data.row.goodsMoney }}
            </template>
            <template slot="serviceMoney" slot-scope="slotProps">
              ￥{{ slotProps.data.row.serviceMoney }}
            </template>
            <template v-slot:goodsPhoto="slotData">
              <el-image
                style="width: 40px; height: 40px"
                :src="imgBaseUrl + '/' + slotData.data.row.goodsPhoto"
              ></el-image>
            </template>
          </e-table>
          <div class="count" style="font-size:14px">
            商品金额合计：<span style="margin-right:10px">￥{{ totalAmount / 100 || '0.00' }}</span>
            <!-- 服务费合计：<span>￥{{ serviceAmount / 100 || '0.00' }}</span> -->
          </div>
        </div>
        <!-- 操作记录 -->
        <div v-show=" tabsIndex === 2">
          <el-table
            :data="operationData"
            :header-cell-style="{ background: '#f5f7fa' }"
            style="width: 100%; margin-top: 30px"
          >
            <el-table-column prop="createTime" label="操作时间" width="250"></el-table-column>
            <el-table-column prop="userName" label="操作者"></el-table-column>
            <el-table-column prop="purchaseStatus" label="采购单状态"></el-table-column>
            <el-table-column prop="operationDetail" label="操作详情"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <Pagination
            :total="total"
            :page-num="pageNum"
            :page-size="pageSize"
            @pageSizeChange="pageSizeChange"
            @pageCurrentChange="pageCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fileDownload from 'js-file-download'
import eTable from '@/components/Tab/tables'
import Pagination from '@/components/Page/pagination'
import { Basic } from '@/api/base'
import { mapGetters } from 'vuex'
export default {
  components: {
    eTable,
    Pagination
  },
  filters: {
    payMethodFilter(payMethod) {
      if (payMethod === 'ALIPAY') {
        return '支付宝'
      } else if (payMethod === 'WECHAT') {
        return '微信'
      } else {
        return '--'
      }
    }
  },
  props: {},
  data() {
    return {
      imgBaseUrl: process.env.VUE_APP_FILE_URL_OBS,
      showSelect: false, // 表格多选
      totalAmount: 0, //  商品总额度
      serviceAmount: 0, // 服务费总额
      statusActive: 0,
      logisticsCompany: '',
      waybillNumber: '',
      statusColor: '#cccccd',
      statusTime: [
        { 'title': '待接单', 'time': '' },
        { 'title': '待付款', 'time': '' },
        { 'title': '待发货', 'time': '' },
        { 'title': '待收货', 'time': '' },
        { 'title': '已完成', 'time': '' }
      ],
      // 分页配置
      pageSize: 10,
      pageNum: 1,
      total: 0,
      pageSize2: 10,
      // tabsList: ['采购单详情', '商品信息', '操作记录'],
      tabsList: ['采购单详情', '商品信息'],
      tabsIndex: 0,
      orderDetails: {},
      goodsData: [],
      operationData: [],
      tableHeadConfig: [
        {
          label: '序号',
          columnType: 'slot',
          slotName: 'goodsNums',
          width: 80
        },
        {
          label: '商品图片',
          columnType: 'slot',
          slotName: 'goodsPhoto',
          width: 80
        },
        {
          label: '商品名称',
          field: 'goodsName'
        },
        {
          label: '规格名称',
          field: 'goodsSpecs'
        },
        {
          label: '商品编码',
          field: 'skuId'
        },
        {
          label: '采购数量',
          field: 'goodsNum'
        },
        {
          label: '单价',
          field: 'goodsPrice',
          columnType: 'slot',
          slotName: 'goodsPrice'
        },
        {
          label: '小计',
          field: 'goodsMoney',
          columnType: 'slot',
          slotName: 'goodsMoney'

        },
        // {
        //   label: '服务费',
        //   field: 'serviceMoney',
        //   columnType: 'slot',
        //   slotName: 'serviceMoney'
        // },
        {
          label: '收货数量',
          field: 'goodsReceivedNum'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.orderList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 采购单详情
    orderList() {
      const params = {
        purchaseId: this.$route.query.purchaseId
      }
      Basic.general('purchase/detail/selectDetailByPurchaseId', params).then(res => {
        if (res.code === 200) {
          this.statusTime[0].time = res.data.createTime
          this.statusTime[1].time = res.data.receiveTime
          this.statusTime[2].time = res.data.payTime
          this.statusTime[3].time = res.data.deliverTime
          this.statusTime[4].time = res.data.receiptTime
          switch (res.data.orderStatusValue) {
            case '待接单':
              this.statusColor = '#FAAD14'
              this.statusActive = 0
              break
            case '待付款':
              this.statusColor = '#FAAD14'
              this.statusActive = 1
              break
            case '待发货':
              this.statusColor = '#1890FF'
              this.statusActive = 2
              break
            case '待收货':
              this.statusColor = '#FF4D4F'
              this.statusActive = 3
              break
            case '已完成':
              this.statusColor = '#452C41A'
              this.statusActive = 4
              break
            default:
              this.statusColor = '#cccccc'
              this.statusActive = 5
          }
          this.orderDetails = res.data
          this.logisticsCompany = this.orderDetails.logisticsCompany
          this.waybillNumber = this.orderDetails.waybillNumber
        }
      })
    },
    // 商品信息
    goodList() {
      const params = {
        purchaseId: this.$route.query.purchaseId
      }
      const vms = this
      Basic.general('purchase/detail/goods/list', params).then(res => {
        if (res.code === 200) {
          this.goodsData = res.data
          res.data.forEach((t, index) => {
            t.indexNum = index
            const tn = t.goodsMoney * 100
            const ts = t.serviceMoney * 100
            vms.totalAmount += tn
            vms.serviceAmount += ts
          })
        }
      })
    },
    // 操作记录
    operationlist() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        purchaseId: this.$route.query.purchaseId
      }
      Basic.general('purchase/operation/list', params).then(res => {
        if (res.code === 200) {
          this.operationData = res.data.records
          this.total = res.data.total
        }
      })
    },
    // 导出数据
    handleExport() {
      const params = {
        purchaseId: this.$route.query.purchaseId
      }
      this.$axios
        .get(`${process.env.VUE_APP_BASE_API}/purchase/operation/export`, {
          responseType: 'blob',
          headers: {
            Authorization: this.token,
            source: 4
          },
          params
        })
        .then(res => {
          fileDownload(res.data, '操作记录.xlsx')
        })
    },
    // 每页查看条数变化
    pageSizeChange(page) {
      this.pageSize = page._pageSize
      this.pageNum = page._currentPage
      this.operationlist()
    },
    // 当前页码变化
    pageCurrentChange(page) {
      this.pageSize = page._pageSize
      this.pageNum = page._currentPage
      this.operationlist()
    },
    // 改变tab选项
    changeTabs(e) {
      const vm = this
      this.totalAmount = 0
      this.serviceAmount = 0
      switch (e) {
        case 0:
          vm.orderList()
          break
        case 1:
          vm.goodList()
          break
        case 2:
          vm.operationlist()
          break
      }
      vm.tabsIndex = e
    }
  }
}
</script>
<style lang="scss" scoped>
.status {
  .status-color {
    float: left;
    width: 8px;
    height: 8px;
    margin: 6px;
    margin-top: 5px;
    border: none;
    border-radius: 10px;
  }
  .status-colors {
     position: relative;
    top: 21px;
    left: 18px;
  }
}
.goods-img {
  display: block;
  width: 40px;
  height: 40px;
}
.page-header {
  padding: 18px 24px;
  background: #fff;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #f5f5f5;
}
/deep/ .el-page-header__title {
  font-size: 20px;
}
/deep/ .el-page-header__left::after {
    width: 0;
  }
.detailBox {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: auto;
  background-color: #ffffff;
  //background: red;
  .leftData {
    height: 100%;
    .progressBox {
      width: 100%;
      padding: 0 24px;
      background: #fff;
      .inner {
        height: 142px;
        padding-top: 50px;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 5px;
        /deep/ .el-step__head.is-success {
          color: #795C98;
          border-color: #795C98;
        }
        /deep/ .el-step__title.is-success {
          color: #795C98;
        }
        /deep/ .el-step__description.is-success{
          color: #795C98;
        }
        /deep/ .el-step__title.is-process,/deep/ .el-step__description.is-process {
          color: #795C98;
        }
        /deep/ .el-step__head.is-process .el-step__icon.is-text {
          background: #795C98;
          color: #fff;
          border: 1px solid #795C98;
        }
      }
    }
    .tableContent {
      position: relative;;
      border-radius: 4px;
      padding: 20px 20px;
      background: #ffffff;
      margin: auto;
      width: 100%;
      min-height: 600px;
      .tableHeader {
        width: 100%;
        display: flex;
        align-items: center;
        //justify-content: space-between;
        margin-bottom: 10px;
        position: relative;
        .name {
          width: 58px;
          height: 46px;
          text-align: center;
          line-height: 46px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Semibold;
          font-weight: 600;
          color: #303133;
          margin-right: 30px;
          cursor: pointer;
        }
        .tabActive {
          color: #1890ff;
          border-bottom: 2px solid #1890ff;
        }
        .NewsButton {
          position: absolute;
          right: 0;
        }
      }

      .goodsDetail {
        display: flex;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
          margin-right: 5px;
        }

        div {
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          p {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            text-align: left;
            color: #606266;
            margin: 0;
          }
        }
      }

      .goAddress {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #1989fa;
        cursor: pointer;
      }
    }
  }

  .rightData {
    width: 96%;
    margin-right: 30px;
    display: flex;
    margin: auto;
    flex-direction: column;
  }
}
.nav {
  background: #fff;
  padding: 30px 30px 0px 30px;
}
.nav_top {
  .nav_div1 {
    float: left;
    font-size: 20px;
  }
  .nav_div2 {
    float: right;
    margin-top: -15px;
  }
}
.nav_bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  font-size: 14px;
  .Basiclist {
    flex: 8;
    // width:100%;
    span {
      display: inline-block;
      margin-bottom: 30px;
      width: 30%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
  .statusMoney {
    margin-top: -1%;
    display: flex;
    .ddzt {
      width: 140px;
      span {
        font-size: 20px;
      }
    }
    .ddje {
      width: 140px;
      span {
        font-size: 20px;
        //color: red;
      }
    }
  }
}
.count {
  text-align: right;
  margin: 10px 130px 0px 0px;
  font-size: 20px;
  span {
    color: red;
  }
}
.icon_color {
  width: 3px;
  height: 20px;
  display: inline-block;
  background: #005aa0;
  margin-right: 5px;
  vertical-align: bottom;
}
.NewsList {
  display: flex;
  width: 100%;
  height: 60px;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  div {
    width: 25%;
    height: 100%;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.02);
    text-indent: 20px;
    line-height: 60px;
  }
  .div {
    background-color: rgba(0, 0, 0, 0.02);
    color: black;
    font-weight: bold;
  }
}
.goosList {
  max-height: 440px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.goosList::-webkit-scrollbar {
  display: none;
}
.expBtn{
  position:absolute;
  top: 36px;
  right: 20px;
  background:#fff;
  color:black;
  border-color:rgba(0,0,0,0.65);
  z-index: 999;
}
</style>
