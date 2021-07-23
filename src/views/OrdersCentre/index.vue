<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div style="width: 100%">
      <searchForm
        style="float: left; margin-top: 5px"
        :option-list="optionList"
        @handle-query="handleQuery"
        @handle-clear="handleClear"
      >
        <el-button size="small" icon="el-icon-search" @click="dialogTableVisible">
          高级筛选
        </el-button>
      </searchForm>
      <div style="clear: both"></div>
    </div>
    <div style="width: 100%">
      <el-button
        size="small"
        icon="el-icon-download"
        style="margin-top: 10px"
        @click="handleExport"
      >
        {{ selectList.length ? '批量导出' : '导出全部' }}
      </el-button>
      <el-button size="small" icon="el-icon-upload2" style="margin-top: 10px" @click="handleNumber">
        导入运单号
      </el-button>
    </div>

    <!-- 表格 -->
    <e-table
      style="margin-top: 10px"
      :table-head-config="tableHeadConfig"
      :table-load-data="dataList"
      @selectLine="selectLine"
      @sortChange="sortChange"
    >
      <template v-slot:operation="slotData">
        <el-button type="text" @click="edit(slotData.data.row)">详情</el-button>
        <el-button
          type="text"
          :disabled="slotData.data.row.orderStatus != 'WAIT_SHIP'"
          @click="close(slotData.data.row)"
        >
          关闭
        </el-button>
        <el-button
          :disabled="slotData.data.row.orderStatus != 'WAIT_SHIP'"
          type="text"
          @click="deliver(slotData.data.row)"
        >
          发货
        </el-button>
      </template>
      <template v-slot:orderType="slotData">
        <span>{{ slotData.data.row.orderType | orderTypeFilter }}</span>
      </template>
      <template v-slot:orderSource="slotData">
        <span>{{ slotData.data.row.orderSource | orderSourceFilter }}</span>
      </template>
      <template v-slot:logisticsCompany="slotData">
        <span>{{ slotData.data.row.logisticsCompany | logisticsCompanyFilter }}</span>
      </template>
      <template v-slot:orderStatus="slotData">
        <div class="status">
          <span class="status-color" :style="{ background: slotData.data.row.statusColor }"></span>
          <span>{{ slotData.data.row.statusName }}</span>
          <!-- <div class="statusBackground">
            <div
              :style="{
                background:
                  slotData.data.row.orderStatus == 'WAIT_SHIP'
                    ? '#FAAD14'
                    : slotData.data.row.orderStatus == 'CANCELLED'
                    ? '#FF4D4F'
                    : slotData.data.row.orderStatus == 'SHIPPED'
                    ? '#1890FF'
                    : slotData.data.row.orderStatus == 'FINISHED'
                    ? '#52C41A'
                    : slotData.data.row.orderStatus == 'CLOSED'
                    ? '#cccccc'
                    : ''
              }"
            ></div>
          </div> -->
          <!-- <div>{{ slotData.data.row.orderStatus | orderStatusFilter }}</div> -->
        </div>
      </template>
      <template v-slot:payMethod="slotData">
        <span>{{ slotData.data.row.payMethod | payMethodFilter }}</span>
      </template>
    </e-table>
    <!-- 分页 -->
    <Pagination
      ref="myPagination"
      :total="total"
      :page-num="pageNum"
      :page-size="pageSize"
      @pageSizeChange="pageSizeChange"
      @pageCurrentChange="pageCurrentChange"
    />
    <!-- 发货弹窗/高级筛选弹窗/导入运单号 -->
    <class-dialog
      :dialog-obj="dialogObj"
      @cancel="cancel"
      @confirm="confirm"
      @closeIcon="closeIcon"
    >
      <div slot="center">
        <!-- 发货 -->
        <el-form
          v-if="dialogIndex === 2"
          ref="sentOut"
          :model="sentOut"
          :rules="rulesSent"
          label-width="80px"
          size="small"
        >
          <el-form-item label="物流公司" prop="logisticsCompany">
            <el-select
              v-model="sentOut.logisticsCompany"
              placeholder="请选择物流公司"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in optionsCompany"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号" prop="waybillNo" style="margin-top: 20px">
            <el-input
              v-model="sentOut.waybillNo"
              onkeyup="this.value=this.value.replace(/[^\w_]/g,'')"
            ></el-input>
          </el-form-item>
        </el-form>
        <!--高级筛选 -->
        <el-form
          v-if="dialogIndex === 1"
          ref="AdvancedForm"
          :model="Advanced"
          :inline="true"
          label-width="90px"
          style="100%;"
        >
          <el-form-item label="搜索查询：" prop="searchKey" style="width: 48%">
            <el-input
              v-model="Advanced.searchKey"
              placeholder="订单编号或商品货号"
              style="width: 260px"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="订单状态：" prop="orderStatus" style="width: 48%">
            <el-select
              v-model="Advanced.orderStatus"
              placeholder="请选择订单状态"
              clearable
              style="width: 260px"
              size="small"
            >
              <el-option
                v-for="item in optionsStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="付款时间：" prop="payTime" style="width: 48%">
            <el-date-picker
              v-model="Advanced.payTime"
              :unlink-panels="true"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 260px"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单来源：" prop="orderSource" style="width: 48%">
            <el-select
              v-model="Advanced.orderSource"
              placeholder="请选择订单来源"
              clearable
              style="width: 260px"
              size="small"
            >
              <el-option
                v-for="item in optionsSource"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式：" prop="payMethod" style="width: 48%">
            <el-select
              v-model="Advanced.payMethod"
              placeholder="请选择支付方式"
              clearable
              style="width: 260px"
              size="small"
            >
              <el-option
                v-for="item in optionsPayMethod"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订单金额：" prop="startMoney" style="width: 48%">
            <el-input
              v-model.number="Advanced.startMoney"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              clearable
              placeholder="最小金额"
              style="max-width: 124px"
              size="small"
              @change="goodNumber"
            ></el-input>
            -
            <el-input
              v-model.number="Advanced.endMoney"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              clearable
              placeholder="最大金额"
              style="max-width: 124px"
              size="small"
              @change="goodNumber"
            ></el-input>
          </el-form-item>
          <el-form-item label="物流公司：" prop="logisticsCompany" style="width: 48%">
            <el-select
              v-model="Advanced.logisticsCompany"
              placeholder="请选择物流公司"
              clearable
              style="width: 260px"
              size="small"
            >
              <el-option
                v-for="item in optionsCompany"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="运单号：" prop="waybillNumber" style="width: 48%">
            <el-input
              v-model="Advanced.waybillNumber"
              placeholder="请输入运单号"
              style="width: 260px"
              size="small"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="发票类型：" style="inline-block;width:44%;">
            <el-radio v-model="Advanced.invoiceType" label="0"
              >普通发票</el-radio
            >
            <el-radio v-model="Advanced.invoiceType" label="1"
              >增值税专用发票</el-radio
            >
          </el-form-item> -->
          <!-- <el-form-item
            label="发票状态："
            style="display: inline-block;width:44%;"
          >
            <el-radio v-model="Advanced.invoiceStatus" label="NOT_INVOICED"
              >未开票</el-radio
            >
            <el-radio v-model="Advanced.invoiceStatus" label="INVOICED"
              >已开票</el-radio
            >
          </el-form-item> -->
        </el-form>
        <!-- 导入运单号 -->
        <el-form v-if="dialogIndex === 3" :rules="rules" label-width="80px" size="small">
          <el-button size="small" @click="download()">下载模板</el-button>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :http-request="changeFile"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            style="margin-top: 10px"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xslx文件，且不超过500kb</div>
          </el-upload>
        </el-form>
      </div>
    </class-dialog>
  </div>
</template>

<script>
// import qs from "qs";
import fileDownload from 'js-file-download'
import eTable from '../../components/Tab/tables'
import Pagination from '../../components/Page/pagination'
import searchForm from '../../components/Search/searchForm'
import classDialog from '../../components/Dialog/Dialog'
import { orderList, infoCancel, infoShip, infoDownload } from '@/api/OrdersList'
import { getToken } from '@/utils/auth'
export default {
  name: '',
  components: {
    eTable,
    Pagination,
    searchForm,
    classDialog
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
    }
  },
  props: {},
  data() {
    return {
      searchData: {},
      dataList: [],
      selectList: [],
      dialogIndex: '',
      fileList: [],
      rules: {},
      fileName: '订单数据.xlsx',
      file: {},
      orderId: '', // 发货订单号
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        }
      ],
      // 物流公司
      optionsCompany: [
        { value: 'YTO_EXPRESS', label: '圆通快递' },
        { value: 'SF_EXPRESS', label: '顺丰快递' },
        { value: 'STO_EXPRESS', label: '申通快递' },
        { value: 'ZTO_EXPRESS', label: '中通快递' },
        { value: 'YUN_DA_EXPRESS', label: '韵达快递' },
        { value: 'EMS', label: '邮政快递' }
      ],
      // 订单状态
      optionsStatus: [
        { value: 'WAIT_SHIP', label: '待发货', color: '#FAAD14' },
        { value: 'CANCELLED', label: '已取消', color: '#FF4D4F' },
        { value: 'SHIPPED', label: '已发货', color: '#1890FF' },
        { value: 'FINISHED', label: '已完成', color: '#52C41A' },
        { value: 'CLOSED', label: '已关闭', color: '#cccccc' }
      ],
      // 订单来源
      optionsSource: [
        { value: 'APPLETS', label: '小程序' },
        { value: 'APP', label: 'APP' },
        { value: 'PC', label: 'PC' },
        { value: 'H5', label: 'H5' }
      ],
      // 支付方式
      optionsPayMethod: [
        { value: 'ALIPAY', label: '支付宝' },
        { value: 'WECHAT', label: '微信' }
      ],
      // 高级筛选
      Advanced: {
        searchKey: '', // 订单编号
        orderStatus: '', // 订单状态
        payTime: '', // 付款时间
        orderSource: '', // 订单来源
        payMethod: '', // 支付方式
        startMoney: '', // 开始金额
        endMoney: '', // 结束金额
        logisticsCompany: '', // 物流公司
        waybillNumber: '' // 运单号
      },
      // 发货
      dialogObj: {
        DialogType: false, // 弹窗开关
        title: '请填写运单信息', // 标题
        width: '20%'
      },
      sentOut: {
        logisticsCompany: '', // 物流公司
        waybillNo: '' // 运单号
      },
      // 搜索配置
      optionList: [
        {
          label: '',
          type: 'input',
          placeholder: '用户账号',
          key: 'account',
          width: '120'
        },
        {
          label: '',
          type: 'input',
          placeholder: '订单编号',
          key: 'orderId',
          width: '120'
        },
        {
          label: '',
          type: 'input',
          placeholder: '商品编码',
          key: 'goodsNo',
          width: '120'
        },
        // {
        //   label: '',
        //   type: 'date2',
        //   placeholder: '付款时间',
        //   key: 'payTime',
        //   width: '120'
        // },
        {
          label: '',
          type: 'select',
          placeholder: '会员名称',
          key: 'username',
          width: '120',
          list: [
            // { value: 1, label: '测试1' },
            // { value: 2, label: '测试2' }
          ]
        },
        {
          label: '',
          type: 'select',
          placeholder: '订单状态',
          key: 'orderStatus',
          width: '120',
          list: [
            { value: 'WAIT_SHIP', label: '待发货' },
            { value: 'CANCELLED', label: '已取消' },
            { value: 'SHIPPED', label: '已发货' },
            { value: 'FINISHED', label: '已完成' },
            { value: 'CLOSED', label: '已关闭' }
          ]
        },
        {
          label: '',
          type: 'select',
          placeholder: '订单来源',
          key: 'orderSource',
          width: '120',
          list: [
            { value: 'APPLETS', label: '小程序' },
            { value: 'APP', label: 'APP' },
            { value: 'PC', label: 'PC' },
            { value: 'H5', label: 'H5' }
          ]
        }
      ],
      // 分页配置
      pageSize: 10,
      pageNum: 1,
      total: 0,
      sort: null, // 表格排序
      sortFiled: '', // 排序字段
      // 表格配置
      tableHeadConfig: [
        {
          label: '订单编号',
          field: 'orderId'
        },
        {
          label: '订单金额',
          field: 'totalMoney'
        },
        {
          label: '订单状态',
          columnType: 'slot',
          slotName: 'orderStatus'
        },
        {
          label: '支付方式',
          columnType: 'slot',
          slotName: 'payMethod'
        },
        {
          label: '订单来源',
          columnType: 'slot',
          slotName: 'orderSource'
        },
        {
          label: '用户账号',
          field: 'account'
        },
        {
          label: '会员名称',
          field: 'username'
        },
        {
          label: '付款时间',
          field: 'payTime',
          sortable: 'custom',
          width: 180
        },
        {
          label: '付款金额',
          field: 'payMoney'
        },
        {
          label: '运费',
          field: 'expressCharge'
        },
        {
          label: '运单号',
          field: 'waybillNumber'
        },
        {
          label: '物流公司',
          columnType: 'slot',
          slotName: 'logisticsCompany'
        },
        {
          label: '订单类型',
          columnType: 'slot',
          slotName: 'orderType' // 一定要对应好上面的状态的slot名字
        },

        {
          label: '操作',
          columnType: 'slot',
          slotName: 'operation',
          width: 160
        }
      ],
      rulesSent: {
        logisticsCompany: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
        waybillNo: [
          { required: true, message: '请输入运单号', trigger: 'blur' },
          { required: true, message: '请输入数字和字母', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.ordersList()
  },
  mounted() {},
  methods: {
    goodNumber() {
      // 价格区间
      const low = this.Advanced.startMoney
      const heigh = this.Advanced.endMoney
      if (low !== '' && heigh !== '') {
        if (low > heigh) {
          this.Advanced.startMoney = heigh
          this.Advanced.endMoney = low
        }
      }
    },
    // 表格排序
    async sortChange(e) {
      const vm = this
      vm.sortFiled = e.prop
      if (e.prop === 'payTime') {
        vm.sortFiled = 'pay_time'
      }
      if (e.order === 'ascending') {
        vm.sort = 'ASC'
      }
      if (e.order === 'descending') {
        vm.sort = 'DESC'
      }
      let params = JSON.parse(JSON.stringify(vm.searchData))
      params = vm.initParams(params)
      vm.searchData = params
      await vm.ordersList()
    },
    // 订单列表
    ordersList() {
      const vm = this
      const search = JSON.parse(JSON.stringify(vm.searchData))
      if (search.payTime && search.payTime.length) {
        search.payStartTime = search.payTime ? search.payTime[0] : ''
        search.payEndTime = search.payTime ? search.payTime[1] : ''
        delete search.payTime
      }
      const params = JSON.parse(JSON.stringify(search))
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      params.sort = this.sort
      params.sortFiled = this.sortFiled || null
      orderList(params).then(res => {
        if (res.code === 200) {
          const arr = res.data.records
          this.dataList = arr.map(t => {
            const { orderStatus } = t
            // 从optionsStatus中找出value === orderStatus 的一项
            const activeItem = vm.optionsStatus.filter(t => t.value === orderStatus)
            if (activeItem.length) {
              t.statusColor = activeItem[0].color
              t.statusName = activeItem[0].label
            }
            return t
          })
          this.total = res.data.total
        }
      })
    },
    // initParams(params) {
    //   const data = JSON.parse(JSON.stringify(params))
    //   for (const key in data) {
    //     if (data[key] === '') {
    //       delete data[key]
    //     }
    //   }
    //   return data
    // },
    // 跳转详情页面
    edit(e) {
      const orderId = e.orderId
      this.$router.push({
        path: 'ordersCentre-detail',
        query: {
          orderId: orderId
        }
      })
    },
    // 多选数组
    selectLine(e) {
      this.selectList = e
      // console.log('selectList++++', this.selectList)
    },
    // 导出数据
    handleExport() {
      const vm = this
      const slect = JSON.parse(JSON.stringify(vm.selectList))
      const url = slect.length ? 'export' : 'export/all'
      const params = slect.length ? { orderIds: slect } : {}
      vm.$axios
        .get(`${process.env.VUE_APP_BASE_API}/order/info/${url}`, {
          headers: {
            Authorization: getToken(),
            source: 4
          },
          responseType: 'blob',
          params
        })
        .then(res => {
          fileDownload(res.data, this.fileName)
        })
        .catch(err => {
          const { response } = err
          if (response.status && response.status === 401) {
            vm.$message.error('暂无操作权限，请联系管理员！')
          }
        })
    },
    // 导入运单号
    handleNumber() {
      this.dialogIndex = 3
      this.dialogObj.DialogType = true
      this.dialogObj.width = '20%'
      this.dialogObj.title = '导入运单号'
    },
    changeFile(val) {
      this.file = val.file
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    // 每页查看条数变化
    pageSizeChange(page) {
      this.pageSize = page._pageSize
      this.pageNum = page._currentPage
      this.ordersList()
    },
    // 当前页码变化
    pageCurrentChange(page) {
      this.pageSize = page._pageSize
      this.pageNum = page._currentPage
      this.ordersList()
    },
    // 查询
    handleQuery(e) {
      const vm = this
      vm.searchData = Object.assign(e)
      this.pageNum = 1
      vm.$refs.myPagination.currentPage = 1
      vm.ordersList()
    },
    // 重置
    handleClear() {
      const vm = this
      vm.searchData = {}
      vm.pageNum = 1
      // vm.sort = null
      // vm.sortFiled = null
      vm.$refs.myPagination.currentPage = 1
      vm.ordersList()
    },
    // 下载模板
    download() {
      infoDownload().then(res => {
        if (res.code === 200) {
          const downloadUrl = res.data
          window.open(downloadUrl, '模板')
          this.dialogObj.DialogType = true
        }
      })
    },
    // 高级筛选弹窗
    dialogTableVisible() {
      this.dialogIndex = 1
      this.dialogObj.DialogType = true
      this.dialogObj.width = '44%'
      this.dialogObj.title = '高级筛选'
    },
    // 发货弹窗
    deliver(row) {
      this.dialogIndex = 2
      this.dialogObj.DialogType = true
      this.dialogObj.width = '20%'
      this.dialogObj.title = '请填写运单信息'
      this.orderId = row.orderId // 订单号
    },
    // 弹窗icon关闭
    closeIcon() {
      this.clear()
      this.clearAdvanced()
      if (this.dialogObj.title === '请填写运单信息') {
        this.$refs['sentOut'].resetFields()
      } else if (this.dialogObj.title === '高级筛选') {
        this.$refs['AdvancedForm'].resetFields()
      } else {
        this.$refs.upload.clearFiles()
      }
    },
    // 弹窗-关闭
    cancel() {
      this.dialogObj.DialogType = false
      this.clear()
      this.clearAdvanced()
      if (this.dialogObj.title === '请填写运单信息') {
        this.$refs['sentOut'].resetFields()
      } else if (this.dialogObj.title === '高级筛选') {
        this.$refs['AdvancedForm'].resetFields()
      } else {
        this.$refs.upload.clearFiles()
      }
    },
    // 弹窗-确定
    async confirm() {
      // 导入运单号
      if (this.dialogIndex === 3) {
        const params = new FormData()
        params.append('file', this.file)
        const url = `${process.env.VUE_APP_BASE_API}/order/info/import/waybill`
        this.$axios
          .post(url, params, {
            headers: {
              Authorization: getToken(),
              source: 4
            }
          })
          .then(res => {
            // console.log('导入:', res)
            if (res.data.code === 200) {
              this.$message.success({
                message: '导入成功',
                duration: 1000,
                center: true,
                width: 60
              })
              this.dialogObj.DialogType = false
              this.$refs.upload.clearFiles()
            } else {
              this.$message.error({
                message: '导入失败',
                duration: 1000,
                center: true,
                width: 60
              })
            }
          })
          .catch(err => {
            const { response } = err
            if (response.status && response.status === 401) {
              this.$message.error('暂无操作权限，请联系管理员！')
            }
          })
      } else if (this.dialogIndex === 2) {
        this.$refs['sentOut'].validate(valid => {
          // 发货
          if (valid) {
            const params = {
              orderId: this.orderId,
              logisticsCompany: this.sentOut.logisticsCompany,
              waybillNo: this.sentOut.waybillNo
            }
            infoShip(params).then(res => {
              if (res.code === 200) {
                this.dialogObj.DialogType = false
                this.ordersList()
                this.clear()
              } else {
                this.dialogObj.DialogType = false
                this.$message.error({
                  message: '发货失败',
                  duration: 1000,
                  center: true,
                  width: 60
                })
                this.clear()
              }
            })
          }
        })
      } else {
        // 高级筛选
        const vm = this
        vm.pageNum = 1
        let params = JSON.parse(JSON.stringify(vm.Advanced))
        params.pageNum = vm.pageNum
        params.pageSize = vm.pageSize
        const { payTime = [] } = params
        if (payTime.length) {
          params.payStartTime = payTime[0]
          params.payEndTime = payTime[1]
        }
        params = vm.initParams(params)
        vm.searchData = params
        vm.$refs.myPagination.currentPage = 1
        await vm.ordersList()
        this.dialogObj.DialogType = false
        this.clearAdvanced()
      }
    },
    initParams(params) {
      if (JSON.stringify(params) !== '{}') {
        const obj = JSON.parse(JSON.stringify(params))
        const data = {}
        for (const key in obj) {
          if (obj[key] !== '' && obj[key] !== undefined) {
            data[key] = obj[key]
          }
        }
        return data
      } else {
        return {}
      }
    },
    // 清除发货信息
    clear() {
      this.sentOut.logisticsCompany = ''
      this.sentOut.waybillNo = ''
    },
    // 清除高级筛选
    clearAdvanced() {
      this.Advanced.searchKey = ''
      this.Advanced.payMethod = ''
      this.Advanced.orderStatus = ''
      this.Advanced.payTime = ''
      this.Advanced.orderSource = ''
      this.Advanced.startMoney = ''
      this.Advanced.endMoney = ''
      this.Advanced.logisticsCompany = ''
      this.Advanced.waybillNumber = ''
    },
    // 关闭订单
    close(row) {
      this.$confirm('此操作不可恢复,确定要关闭该订单吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          const orderId = row.orderId
          const params = {
            orderId: orderId
          }
          infoCancel(params).then(res => {
            this.ordersList()
            this.$message({
              type: 'success',
              message: '关闭成功'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container /deep/ .filter-view {
  width: 480px;
}

.status {
  .status-color {
    float: left;
    width: 8px;
    height: 8px;
    margin: 6px;
    border: none;
    border-radius: 10px;
  }
}
</style>
