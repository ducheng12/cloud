<template>
  <div class="detailBox">
    <el-page-header content="订单详情" class="page-header" @back="goBack"></el-page-header>
    <div class="leftData">
      <div class="nav">
        <div class="nav_top">
          <div class="nav_div1">订单编号：{{ orderDetails.orderId }}</div>
          <div style="clear: both"></div>
        </div>
        <div class="nav_bottom">
          <div class="Basiclist">
            <span>订单来源： {{ orderDetails.orderSource | orderSourceFilter }}</span>
            <span>订单类型：{{ orderDetails.orderType | orderTypeFilter }}</span>
            <span>支付时间：{{ orderDetails.payTime }}</span>
            <span>支付方式：{{ orderDetails.payMethod | payMethodFilter }}</span>
            <span>配送方式：{{ orderDetails.logisticsCompany | logisticsCompanyFilter }}</span>
          </div>
          <div class="statusMoney">
            <div class="ddzt">
              <p>订单状态</p>
              <span>{{ orderDetails.orderStatus | orderStatusFilter }}</span>
            </div>
            <div class="ddje">
              <p>订单金额</p>
              <span>￥{{ orderDetails.totalMoney }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="progressBox">
        <div class="inner">
          <el-steps :active="active" align-center finish-status="success">
            <el-step title="支付订单"></el-step>
            <el-step title="平台发货"></el-step>
            <el-step title="确认收货"></el-step>
            <el-step title="完成评价"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="tableContent">
        <div class="tableHeader">
          <div
            v-for="(item, index) in tabsList"
            :key="index"
            class="name"
            :class="{ tabActive: index == tabsIndex }"
            @click="changeTabs(index)"
          >
            {{ item }}
          </div>
          <div class="NewsButton">
            <el-button
              v-if="orderDetails.orderStatus == 'WAIT_SHIP'"
              v-show="tabsIndex === 0"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editGoods()"
            >
              编辑
            </el-button>
            <el-button
              v-if="orderDetails.orderStatus == 'WAIT_SHIP'"
              v-show="tabsIndex === 1"
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="addGoods"
            >
              新增
            </el-button>
            <el-button
              v-show="tabsIndex === 2"
              type="primary"
              icon="el-icon-upload2"
              size="small"
              @click="handleExport"
            >
              导出数据
            </el-button>
          </div>
        </div>
        <!-- 订单详情 -->
        <div v-show="tabsIndex === 0">
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>订单信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">订单编号</div>
              <div class="div">支付时间</div>
              <div class="div">订单状态</div>
              <div class="div">支付方式</div>
            </div>
            <div class="NewsList">
              <div>{{ orderDetails.orderId }}</div>
              <div>{{ orderDetails.payTime }}</div>
              <div>
                {{ orderDetails.orderStatus | orderStatusFilter }}
              </div>
              <div>
                {{ orderDetails.payMethod | payMethodFilter }}
              </div>
            </div>
            <div class="NewsList">
              <div class="div">订单来源</div>
              <div class="div">用户账号</div>
            </div>
            <div class="NewsList">
              <div>
                {{ orderDetails.orderSource | orderSourceFilter }}
              </div>
              <div>{{ orderDetails.account }}</div>
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
              <div>{{ orderDetails.name }}</div>
              <div>{{ orderDetails.telephone }}</div>
              <div>{{ orderDetails.zipCode }}</div>
              <div style="overflow: hidden; white-space: nowrap">{{ orderDetails.address }}</div>
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
            <div class="NewsList">
              <div>
                {{ orderDetails.logisticsCompany | logisticsCompanyFilter }}
              </div>
              <div>{{ orderDetails.waybillNumber }}</div>
              <div>{{ receiptTime }}</div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>支付信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">订单金额</div>
              <div class="div">运费</div>
              <div class="div">付款金额</div>
              <div class="div">支付方式</div>
            </div>
            <div class="NewsList">
              <div>{{ orderDetails.totalMoney }}</div>
              <div>{{ orderDetails.expressCharge }}</div>
              <div>{{ orderDetails.payMoney }}</div>
              <div>
                {{ orderDetails.payMethod | payMethodFilter }}
              </div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div class="detailContent" style="font-size: 16px">
              <i class="icon_color"></i>发票信息
            </div>
            <div class="NewsList" style="margin-top: 20px">
              <div class="div">发票抬头类型</div>
              <div class="div">发票类型</div>
              <div class="div">发票种类</div>
              <div class="div">发票抬头</div>
            </div>
            <div class="NewsList">
              <div>
                {{ orderDetails.invoiceTitleType | invoiceTitleTypeFilter }}
              </div>
              <div>
                {{ orderDetails.invoiceType | invoiceTypeFilter }}
              </div>
              <div>
                {{ orderDetails.invoiceKind | invoiceKindFilter }}
              </div>
              <div>{{ orderDetails.invoiceTitle }}</div>
            </div>
            <div class="NewsList">
              <div class="div">发票内容</div>
              <div class="div">纳税人识别号</div>
              <div class="div">发票金额</div>
              <div class="div">开户行</div>
            </div>
            <div class="NewsList">
              <div>{{ orderDetails.invoiceContent }}</div>
              <div>{{ orderDetails.taxpayerNo }}</div>
              <div>{{ orderDetails.invoiceMoney }}</div>
              <div>
                {{ orderDetails.accountBank == 'BANK_OF_CHINA' ? '中国银行' : '' }}
              </div>
            </div>
            <div class="NewsList">
              <div class="div">账号</div>
              <div class="div">地址</div>
            </div>
            <div class="NewsList">
              <div>{{ orderDetails.invoiceAccount }}</div>
              <div>{{ orderDetails.invoiceAddress }}</div>
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
            <template v-slot:goodsPhoto="slotData">
              <el-image
                style="width: 40px; height: 40px"
                :src="imgBaseUrl + '/' + slotData.data.row.goodsPhoto"
              ></el-image>
            </template>
            <template v-slot:operation="slotData">
              <el-button
                type="text"
                :disabled="orderDetails.orderStatus != 'WAIT_SHIP'"
                @click="close(slotData.data.row)"
              >
                删除
              </el-button>
              <el-button
                type="text"
                :disabled="orderDetails.orderStatus != 'WAIT_SHIP'"
                @click="changeGoods(slotData.data.row)"
              >
                替换
              </el-button>
            </template>
          </e-table>
          <div class="count">
            合计：<span>￥{{ price }}</span>
          </div>
        </div>
        <!-- 操作记录 -->
        <div v-show="tabsIndex === 2">
          <el-table
            :data="operationData"
            :header-cell-style="{ background: '#f5f7fa' }"
            style="width: 100%; margin-top: 30px"
          >
            <el-table-column prop="createTime" label="操作时间" width="250"></el-table-column>
            <el-table-column prop="account" label="操作者"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态">
              <template slot-scope="scope">
                {{ scope.row.orderStatus | orderStatusFilter }}
              </template>
            </el-table-column>
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
    <!-- 编辑订单&&&新增/替换商品弹窗 -->
    <class-dialog
      :dialog-obj="dialogObj"
      @cancel="cancel"
      @confirm="confirm"
      @closeIcon="closeIcon"
    >
      <div slot="center">
        <!-- 编辑订单 -->
        <div v-if="tabsIndex === 0">
          <el-form
            ref="sentOutForm"
            :model="sentOut"
            :rules="rulesSentOut"
            size="small"
            label-width="100px"
          >
            <el-form-item label="收货人:" prop="name">
              <el-input v-model="sentOut.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码:" prop="telephone" style="margin-top: 20px">
              <el-input v-model.number="sentOut.telephone"></el-input>
            </el-form-item>
            <el-form-item label="邮政编码:" prop="zipCode" style="margin-top: 20px">
              <el-input v-model="sentOut.zipCode"></el-input>
            </el-form-item>
            <el-form-item label="收货地址:" prop="address" style="margin-top: 20px">
              <el-input v-model="sentOut.address"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="tabsIndex === 1">
          <el-form ref="goodsSearch" :inline="true" :model="goodsSearch" size="small">
            <el-form-item prop="goodsName">
              <el-input v-model="goodsSearch.goodsName" clearable placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item prop="firstCategoryId">
              <el-select
                v-model="goodsSearch.firstCategoryId"
                clearable
                placeholder="一级分类"
                @change="
                  val => {
                    changeSelect(val, index)
                  }
                "
              >
                <el-option
                  v-for="item in selectBaseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="secondCategoryId">
              <el-select
                v-model="goodsSearch.secondCategoryId"
                placeholder="二级分类"
                :disabled="disabled"
                clearable
              >
                <el-option
                  v-for="item in secondList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierId">
              <el-select v-model="goodsSearch.supplierId" clearable placeholder="供应商">
                <el-option
                  v-for="item in supplierLists"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input v-model="goodsSearch.skuCode" clearable placeholder="sku编码"></el-input>
            </el-form-item>
            <el-form-item prop="skuName">
              <el-input v-model="goodsSearch.skuName" clearable placeholder="规格名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" con="el-icon-search" @click="handleQuery">
                查询
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            style="margin-top: 30px"
            :header-cell-style="{
              background: '#f5f7fa',
              color: '#606266'
            }"
            :data="goodsList"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="goodsNo" label="商品编码"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称">
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称"> </el-table-column>
            <el-table-column prop="skuCode" label="sku编码"> </el-table-column>
            <el-table-column prop="supplierName" label="供应商"> </el-table-column>
            <el-table-column prop="firstCateName" label="分类"> </el-table-column>
            <el-table-column prop="isShelves" label="状态">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.isShelves | isShelvesFilter }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间"> </el-table-column>
            <el-table-column label="数量" prop="goodsNum" width="120px">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.goodsNum"
                  size="mini"
                  placeholder="输入"
                  controls-position="right"
                  style="width: 100%"
                  :min="1"
                  @change="handleChange(scope.row)"
                >
                  {{ scope.row.goodsNum == null ? 1 : scope.row.goodsNum }}
                </el-input-number>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <Pagination
            ref="myPagination"
            :total="total2"
            :page-num="pageNum2"
            :page-size="pageSize2"
            @pageSizeChange="pageSizeChange2"
            @pageCurrentChange="pageCurrentChange2"
          />
        </div>
      </div>
      <!--  -->
    </class-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import fileDownload from 'js-file-download'
import eTable from '@/components/Tab/tables'
import classDialog from '@/components/Dialog/Dialog'
import Pagination from '@/components/Page/pagination'
import { mapGetters } from 'vuex'
import {
  orderDetail,
  goodsList,
  updateInfo,
  goodsDelete,
  goodsListT,
  operationList,
  goodsAdd,
  goodsReplace,
  supplierList,
  selectBase,
  pageByCateId
} from '@/api/OrdersList'
export default {
  components: {
    eTable,
    classDialog,
    Pagination
  },
  filters: {
    orderTypeFilter(orderType) {
      if (orderType === 'NORMAL_ORDER') {
        return '普通订单'
      } else if (orderType === 'EXCHANGE_ORDER') {
        return '换货订单'
      } else {
        return ''
      }
    },
    orderSourceFilter(orderSource) {
      if (orderSource === 'APPLETS') {
        return '小程序'
      } else if (orderSource === 'APP') {
        return 'APP'
      } else if (orderSource === 'PC') {
        return 'PC'
      } else if (orderSource === 'H5') {
        return 'H5'
      } else {
        return ''
      }
    },
    logisticsCompanyFilter(logisticsCompany) {
      if (logisticsCompany === 'YTO_EXPRESS') {
        return '圆通快递'
      } else if (logisticsCompany === 'SF_EXPRESS') {
        return '顺丰快递'
      } else if (logisticsCompany === 'STO_EXPRESS') {
        return '申通快递'
      } else if (logisticsCompany === 'ZTO_EXPRESS') {
        return '中通快递'
      } else if (logisticsCompany === 'YUN_DA_EXPRESS') {
        return '韵达快递'
      } else if (logisticsCompany === 'EMS') {
        return '邮政快递'
      } else {
        return ''
      }
    },
    orderStatusFilter(orderStatus) {
      if (orderStatus === 'WAIT_SHIP') {
        return '待发货'
      } else if (orderStatus === 'CANCELLED') {
        return '已取消'
      } else if (orderStatus === 'SHIPPED') {
        return '已发货'
      } else if (orderStatus === 'FINISHED') {
        return '已完成'
      } else if (orderStatus === 'CLOSED') {
        return '已关闭'
      } else {
        return ''
      }
    },
    payMethodFilter(payMethod) {
      if (payMethod === 'ALIPAY') {
        return '支付宝'
      } else if (payMethod === 'WECHAT') {
        return '微信'
      } else {
        return ''
      }
    },
    isShelvesFilter(isShelves) {
      switch (isShelves) {
        case 0:
          return '下架'
        case 1:
          return '上架'
        case 2:
          return '待售'
      }
    },
    invoiceTitleTypeFilter(invoiceTitleType) {
      if (invoiceTitleType === 'PERSONAL') {
        return '个人'
      } else if (invoiceTitleType === 'ENTERPRISE') {
        return '企业'
      } else {
        return ''
      }
    },
    invoiceTypeFilter(invoiceType) {
      if (invoiceType === 'PAPER_INVOICE') {
        return '纸质发票'
      } else if (invoiceType === 'ELECTRONIC_INVOICE') {
        return '电子发票'
      } else if (invoiceType === 'VAT_INVOICE') {
        return '增值税发票'
      } else {
        return ''
      }
    },
    invoiceKindFilter(invoiceKind) {
      if (invoiceKind === 'VAT_SPECIAL_INVOICE') {
        return '增值税专业发票'
      } else if (invoiceKind === 'VAT_GENERAL_INVOICE') {
        return '增值税普通发票'
      } else {
        return ''
      }
    }
  },
  props: {},
  data() {
    // 验证手机号
    var checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }

    return {
      imgBaseUrl: process.env.VUE_APP_FILE_URL_OBS,
      showSelect: false, // 表格多选
      price: '', // 合计
      receiptTime: '', // 时间
      fileName: '操作记录.xlsx',
      // 分页配置
      pageSize: 10,
      pageNum: 1,
      total: 0,
      pageSize2: 10,
      pageNum2: 1,
      total2: 0,
      selectLine: [], // 多选
      tabsList: ['订单详情', '商品信息', '操作记录'],
      active: 0,
      tabsIndex: 0,
      orderDetails: {},
      goodsData: [],
      goodsList: [],
      operationData: [],
      skuId: '',
      orderId: '',
      statuaAdd: false, // 替换
      supplierLists: [], // 供应商
      selectBaseList: [], // 一级分类
      selectBaseId: '', // 一级分类id
      secondList: [], // 二级分类
      disabled: true,
      tableHeadConfig: [
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
          label: '价格',
          field: 'goodsPrice'
        },
        {
          label: '商品编码',
          field: 'goodsNo'
        },
        {
          label: '规格名称',
          field: 'goodsSpecs'
        },
        {
          label: '数量',
          field: 'goodsNum'
        },
        {
          label: '小计',
          field: 'goodsMoney'
        },
        {
          label: '操作',
          columnType: 'slot',
          slotName: 'operation',
          width: 120
        }
      ],
      tableHeadGood: [
        {
          label: '商品编码',
          field: 'goodsNo'
        },
        {
          label: '商品名称',
          field: 'name'
        },
        {
          label: '规格名称',
          field: 'size'
        },
        {
          label: 'sku编码',
          field: 'skuCode'
        },
        {
          label: '供应商',
          field: 'supplierName'
        },
        {
          label: '分类',
          field: 'firstCateName'
        },
        {
          label: '状态',
          field: 'goodsSpecs'
        },
        {
          label: '添加时间',
          field: 'updateTime'
        },
        {
          label: '数量',
          columnType: 'slot',
          slotName: 'operation',
          width: 120
        }
      ],
      sentOut: {
        address: '', // 地址
        name: '', // 姓名
        telephone: '', // 电话
        zipCode: '' // 右边
      },
      goodsSearch: {
        goodsName: '', // 商品名称
        skuCode: '', // sku编码
        skuName: '', // 规格名称
        firstCategoryId: '', // 一级分类id
        secondCategoryId: '', // 二级分类id
        supplierId: '' // 供应商名称
      },
      rulesSentOut: {
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        name: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
        // zipCode: [
        //   { required: true, message: "请输入邮政编码", trigger: "blur" }
        // ]
      },
      // 新增/替换商品弹窗
      dialogObj: {
        DialogType: false, // 弹窗开关
        title: '新增', // 标题
        width: '40%'
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.orderList()
    // this.supplier()
    // this.firstCategoryId()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 订单详情
    orderList() {
      const params = {
        orderId: this.$route.query.orderId
      }
      orderDetail(params).then(res => {
        if (res.code === 200) {
          this.orderDetails = res.data
          if (this.orderDetails.receiptTime) {
            const time = new Date(this.orderDetails.receiptTime)
            this.receiptTime = moment(time).format('YYYY-MM-DD HH:mm:ss')
          }
          if (res.data.orderStatus === 'WAIT_SHIP') {
            this.active = 1
          } else if (res.data.orderStatus === 'SHIPPED') {
            this.active = 2
          } else if (res.data.orderStatus === 'FINISHED' || res.data.orderStatus === 'CLOSE') {
            this.active = 3
          } else {
            this.active = ''
          }
        }
      })
    },
    // 商品信息
    goodList() {
      const params = {
        orderId: this.$route.query.orderId
      }
      goodsList(params).then(res => {
        if (res.code === 200) {
          this.goodsData = res.data
          // console.log('商品列表:', this.goodsData)
          const price = this.goodsData.reduce(
            (sum, e) => sum + Number(e.goodsPrice || 0) * e.goodsNum,
            // (sum, e) => sum + Number(e.goodsMoney || 0) ,
            0
          )
          this.price = price
        }
      })
    },
    // 操作记录
    operationlist() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderId: this.$route.query.orderId
      }
      operationList(params).then(res => {
        if (res.code === 200) {
          this.operationData = res.data.records
          this.total = res.data.total
        }
      })
    },
    // 商品信息-商品列表
    goodListTice() {
      const params = {
        goodsName: this.goodsSearch.goodsName || null,
        firstCategoryId: this.goodsSearch.firstCategoryId || null,
        secondCategoryId: this.goodsSearch.secondCategoryId || null,
        supplierId: this.goodsSearch.supplierId || null,
        skuCode: this.goodsSearch.skuCode || null,
        skuName: this.goodsSearch.skuName || null,
        selectType: 1,
        status: 1,
        pageNum: this.pageNum2,
        pageSize: this.pageSize2
      }
      goodsListT(params).then(res => {
        if (res.code === 200) {
          // console.log('res:', res)
          this.goodsList = res.data.records
          this.total2 = res.data.total
        }
      })
    },
    // 供应商列表
    supplier() {
      supplierList().then(res => {
        if (res.code === 200) {
          console.log('供应商列表', res)
          this.supplierLists = res.data
        }
      })
    },
    // 一级分类
    firstCategoryId() {
      selectBase().then(res => {
        if (res.code === 200) {
          this.selectBaseList = res.data
        }
      })
    },
    changeSelect(val) {
      // console.log("一级分类id", val);
      this.selectBaseId = val
      if (this.selectBaseId) {
        this.secondCategoryId()
        this.disabled = false
      }
    },
    // 二级分类
    secondCategoryId() {
      pageByCateId({ parentId: this.selectBaseId }).then(res => {
        this.secondList = res.data
      })
    },
    // 表格多选
    handleSelectionChange(e) {
      console.log('selectLine', e)
      this.selectLine = e
    },
    // 数量
    handleChange(e) {
      if (this.selectLine.length > 0) {
        const data = e
        this.selectLine = [...data, data]
        // let numberList = [];
        // numberList = numberList.push(data);
        // this.selectLine = numberList;
      }
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
    pageSizeChange2(page) {
      this.pageSize2 = page._pageSize
      this.pageNum2 = page._currentPage
      this.goodListTice()
    },
    pageCurrentChange2(page) {
      this.pageSize2 = page._pageSize
      this.pageNum2 = page._currentPage
      this.goodListTice()
    },
    // 改变tab选项
    changeTabs(e) {
      const vm = this
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
    },
    // 查询商品信息
    handleQuery() {
      this.pageNum2 = 1
      this.$refs.myPagination.currentPage = 1
      this.goodListTice()
    },

    // 导出数据
    handleExport() {
      const params = {
        orderId: this.$route.query.orderId
      }
      this.$axios
        .get(`${process.env.VUE_APP_BASE_API}/order/info/operation/export`, {
          responseType: 'blob',
          headers: {
            Authorization: this.token,
            source: 4
          },
          params
        })
        .then(res => {
          console.log('res++++:', res.data)
          fileDownload(res.data, this.fileName)
        })
    },
    // 编辑订单
    editGoods() {
      this.dialogObj.width = '20%'
      this.dialogObj.DialogType = true
      this.dialogObj.title = '编辑'
      this.sentOut.address = this.orderDetails.address
      this.sentOut.name = this.orderDetails.name
      this.sentOut.telephone = this.orderDetails.telephone
      this.sentOut.zipCode = this.orderDetails.zipCode
    },
    // 移除商品
    close(row) {
      this.$confirm('此操作不可恢复,确定要删除该商品吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          const skuId = row.skuId
          const params = {
            orderId: this.$route.query.orderId,
            skuId: skuId
          }
          goodsDelete(params).then(res => {
            if (res.code === 200) {
              this.goodList()
              this.operationlist()
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
    },
    // 新增商品
    addGoods() {
      this.dialogObj.width = '80%'
      this.dialogObj.DialogType = true
      this.dialogObj.title = '新增'
      this.statuaAdd = false
      this.pageNum2 = 1
      // this.$refs.myPagination.currentPage = 1
      this.goodListTice()
      this.supplier()
      this.firstCategoryId()
      this.clear()
    },
    // 替换商品
    changeGoods(row) {
      this.statuaAdd = true
      this.skuId = row.skuId
      this.orderId = row.orderId
      this.dialogObj.width = '80%'
      this.dialogObj.DialogType = true
      this.dialogObj.title = '替换'
      this.pageNum2 = 1
      this.$refs.myPagination.currentPage = 1
      this.goodListTice()
      this.clear()
    },
    // 弹窗icon关闭
    closeIcon() {
      this.clear()
      if (this.dialogObj.title === '编辑') {
        this.$refs['sentOutForm'].resetFields()
      }
    },
    // 关闭弹窗
    cancel() {
      this.dialogObj.DialogType = false
      this.clear()
      if (this.dialogObj.title === '编辑') {
        this.$refs['sentOutForm'].resetFields()
      }
    },
    // 提交表单
    confirm() {
      // 编辑收货人地址
      if (this.tabsIndex === 0) {
        this.$refs['sentOutForm'].validate(valid => {
          if (valid) {
            const params = {
              orderId: this.$route.query.orderId,
              address: this.sentOut.address,
              name: this.sentOut.name,
              telephone: this.sentOut.telephone,
              zipCode: this.sentOut.zipCode
            }
            updateInfo(params).then(res => {
              if (res.code === 200) {
                this.dialogObj.DialogType = false
                this.orderList()
              }
            })
          }
        })
      }
      // 新增&替换商品
      if (this.statuaAdd === false && this.tabsIndex === 1) {
        const vm = this
        const goodsList = JSON.parse(JSON.stringify(vm.selectLine))
        let data = []
        data = goodsList.map(item => {
          if (item.goodsNum === undefined || '') {
            return {
              skuId: item.skuCode,
              goodsNum: 1,
              specName: item.skuName
            }
          } else {
            return {
              skuId: item.skuCode,
              goodsNum: item.goodsNum,
              specName: item.skuName
            }
          }
        })
        // console.log("新增data:", data);
        if (data.length === 0) {
          this.$message.error({
            message: '请选择商品',
            duration: 1000,
            center: true,
            width: 60
          })
        } else {
          const params = {
            goodsList: data,
            orderId: this.$route.query.orderId
          }
          goodsAdd(params).then(res => {
            if (res.code === 200) {
              // console.log('新增res:', res)
              this.dialogObj.DialogType = false
              this.goodList()
              this.operationlist()
            }
          })
        }
      }
      if (this.statuaAdd === true && this.tabsIndex === 1) {
        const vm = this
        const goodsList = JSON.parse(JSON.stringify(vm.selectLine))
        let data = []
        data = goodsList.map(item => {
          if (item.goodsNum === undefined || '') {
            return {
              skuId: item.skuCode,
              goodsNum: 1,
              specName: item.skuName
            }
          } else {
            return {
              skuId: item.skuCode,
              goodsNum: item.goodsNum,
              specName: item.skuName
            }
          }
        })
        if (data.length === 0) {
          this.$message.error({
            message: '请选择商品',
            duration: 1000,
            center: true,
            width: 60
          })
        } else {
          const params = {
            goodsList: data,
            orderId: this.orderId,
            skuId: this.skuId
          }
          goodsReplace(params).then(res => {
            if (res.code === 200) {
              // console.log('替换res:', res)
              this.dialogObj.DialogType = false
              this.goodList()
              this.operationlist()
            }
          })
        }
      }
    },
    // 清除搜索表单
    clear() {
      this.goodsSearch.goodsName = ''
      this.goodsSearch.firstCategoryId = ''
      this.goodsSearch.secondCategoryId = ''
      this.goodsSearch.supplierId = ''
      this.goodsSearch.skuCode = ''
      this.goodsSearch.skuName = ''
    }
  }
}
</script>
<style lang="scss" scoped>
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
          color: #1890FF;
          border-color: #1890FF;
        }
        /deep/ .el-step__title.is-success {
          color: #1890FF;
        }
        /deep/ .el-step__head.is-process .el-step__icon.is-text {
          background: #1890FF;
          color: #fff;
          border: 1px solid #1890FF;
        }
      }
    }
    .tableContent {
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
    }
  }
  .statusMoney {
    margin-top: -1%;
    display: flex;
    .ddzt {
      width: 100px;
      span {
        font-size: 20px;
      }
    }
    .ddje {
      width: 100px;
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
</style>
