<!-- 新增/修改弹窗 -->
<template>
  <div class="create-supplier">
    <public-dialog
      :title="title"
      :visible="visible"
      :custom-class="'dialog-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form
        ref="rulesForm"
        :model="formData"
        size="small"
        label-width="140px"
        style="padding: 0 32px"
      >
        <el-form-item label-width="0px" class="label-title">
          <span class="label-index">1</span>
          <span>营业执照信息</span>
          <span class="label-tail"></span>
        </el-form-item>
        <el-form-item label="营业执照:">
          <div class="img-view">
            <div class="business-license">
              <img v-if="formData.busiLicImg" :src="formData.busiLicImg" alt="营业执照">
              <i v-else class="el-icon-picture-outline"></i>
            </div>
          </div>
          <el-link @click="showLargerImage">点击查看大图<i class="el-icon-view el-icon--right"></i> </el-link>
        </el-form-item>
        <el-form-item label="供应商全称:">
          <span>{{ formData.fullName }}</span>
        </el-form-item>
        <el-form-item label="供应商地址:">
          <span>{{ formData.fullAddress }}</span>
        </el-form-item>
        <el-form-item label="法人:">
          <span>{{ formData.legalPerson }}</span>
        </el-form-item>
        <el-form-item label="统一社会信用代码:">
          <span>{{ formData.creditCode }}</span>
        </el-form-item>
        <el-form-item label-width="0px" class="label-title">
          <span class="label-index">2</span>
          <span>其他信息</span>
          <span class="label-tail"></span>
        </el-form-item>
        <el-form-item label="联系人:">
          <span style="margin-right: 10px;">{{ formData.relation }}</span>
          <span>{{ formData.relationPhone }}</span>
        </el-form-item>
        <el-form-item label="业务联系人:">
          <span style="margin-right: 10px;">{{ formData.salePhone }}</span>
        </el-form-item>
        <el-form-item label="商圈:">
          <span style="margin-right: 10px;">{{ formData.areaName }}</span>
        </el-form-item>
        <el-form-item label="合同起止日期:">
          <span>{{ formData.contStartTime }} 至 {{ formData.contEndTime }}</span>
        </el-form-item>
        <el-form-item label="合同签订日期:">
          <span>{{ formData.contSignTime }}</span>
        </el-form-item>
        <el-form-item label="创建人:">
          <span>{{ formData.creatorName || '--' }}</span>
        </el-form-item>
        <el-form-item v-if="showType === 3 || showType === 4" label="审批人:">
          <span>{{ formData.approver || '--' }}</span>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <template v-if="showType === 4">
          <el-button type="primary" size="small" @click="handleCancel">关 闭</el-button>
        </template>
        <template v-else>
          <el-button size="small" @click="handleCancel">取 消</el-button>
          <el-button type="primary" size="small" @click="handleConfirm">{{ showType === 3 ? '审 核' : '确 定' }}</el-button>
        </template>
      </template>
    </public-dialog>
    <div v-if="showImage" class="larger-image-view">
      <div class="mask-layer" @click="showImage = false"></div>
      <div class="image-view">
        <img :src="formData.busiLicImg" class="image">
      </div>
    </div>
  </div>
</template>

<script>
import PublicDialog from '@/components/Dialog/PublicDialog'
import { cityData } from '@/utils/cityData'
import { Basic } from '@/api/base'

export default {
  components: { PublicDialog },
  props: {
    showAdd: {
      type: Boolean,
      default: false
    },
    supplierId: {
      type: String,
      default: ''
    },
    showType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: '新增供应商',
      visible: false,
      formData: {
        id: '',
        busiLicImg: '',
        fullName: '',
        fullAddress: '',
        legalPerson: '',
        creditCode: '',
        relation: '',
        salePhone: '',
        areaName: '',
        relationPhone: '',
        contStartTime: '',
        contEndTime: '',
        contSignTime: '',
        creatorName: '',
        approver: ''
      },
      cityList: [],
      showImage: false
    }
  },
  computed: {},
  watch: {
    showAdd: {
      handler: function() {
        this.visible = this.showAdd
      },
      immediate: true
    },
    showType: {
      handler: function() {
        switch (this.showType) {
          case 3:
            this.title = '供应商审核'
            break
          case 4:
            this.title = '供应商详情'
            break
          default:
            break
        }
      },
      immediate: true
    },
    supplierId: {
      handler: function() {
        if (this.supplierId) {
          this.getSupplierInfo()
        }
      },
      immediate: true
    }
  },
  mounted() {
    const vm = this
    vm.cityList = cityData()
  },
  methods: {
    // 获取供应商信息
    getSupplierInfo() {
      const vm = this
      const id = vm.supplierId
      Basic.info('supplier', { id }).then(res => {
        const { data } = res
        vm.initFormData(data)
      })
    },
    initFormData(val) {
      const vm = this
      const data = JSON.parse(JSON.stringify(val))
      vm.formData.id = data.id
      vm.formData.busiLicImg = data.busiLicImg
      vm.formData.fullName = data.fullName
      vm.formData.fullAddress = data.fullAddress
      vm.formData.legalPerson = data.legalPerson
      vm.formData.creditCode = data.creditCode
      vm.formData.relation = data.relation
      vm.formData.areaName = data.areaName
      vm.formData.salePhone = data.salePhone
      vm.formData.relationPhone = data.relationPhone
      vm.formData.contStartTime = data.contStartTime
      vm.formData.contEndTime = data.contEndTime
      vm.formData.contSignTime = data.contSignTime
      vm.formData.contEndTime = data.contEndTime
      vm.formData.creatorName = data.creatorName
      vm.formData.approver = data.approver
    },
    // 上传营业执照
    handlePreview(val) {
      const vm = this
      const formData = new FormData()
      formData.append('file', val.file)
      formData.append('path', 1)
      formData.append('useDay', 1)
      const url = '/file/uploadFile'
      Basic.upLoad(url, formData).then(res => {
        const { data } = res
        const { ip, fileUrl } = data
        vm.formData.busiLicImg = ip + '/' + fileUrl
      })
    },
    // 地区选择
    handleArea(val) {
      const vm = this
      vm.formData.province = parseInt(val[0])
      vm.formData.city = parseInt(val[1])
      vm.formData.district = parseInt(val[2])
    },
    handleCancel() {
      this.$emit('closed')
    },
    handleConfirm() {
      const vm = this
      const type = vm.showType
      switch (type) {
        case 3:
          // 审核
          vm.handleCheck()
          break
        case 4:
          // 查看
          vm.$emit('closed')
          break
        default:
          vm.$emit('closed')
          break
      }
    },
    // 审核
    handleCheck() {
      const vm = this
      const { id } = vm.formData
      const params = {
        id,
        status: 1
      }
      Basic.normal('supplier/auditSupplier', params).then(res => {
        vm.$message({
          showClose: true,
          message: '供应商审核成功！',
          type: 'success'
        })
        vm.$emit('closed', vm.showType)
      })
    },
    afterClosed() {
      const vm = this
      vm.formData.id = ''
      vm.formData.busiLicImg = ''
      vm.formData.fullName = ''
      vm.formData.province = ''
      vm.formData.city = ''
      vm.formData.district = ''
      vm.formData.region = []
      vm.formData.address = ''
      vm.formData.legalPerson = ''
      vm.formData.creditCode = ''
      vm.formData.relation = ''
      vm.formData.areaName = ''
      vm.formData.salePhone = ''
      vm.formData.relationPhone = ''
      vm.formData.contStartTime = ''
      vm.formData.contEndTime = ''
      vm.formData.contSignTime = ''
      vm.formData.contEndTime = ''
      vm.formData.creatorName = ''
      vm.formData.approver = ''
      vm.$refs['rulesForm'].resetFields()
    },
    showLargerImage() {
      this.showImage = true
    }
  }
}
</script>
<style lang='scss' scoped>
.create-supplier /deep/ .dialog-view {
  width: 716px;
}

.label-title {
  span {
    float: left;
  }
  /deep/ .el-form-item__content {
    // font-weight: bold;
    color: #005aa0;
    font-size: 15px;
    line-height: 24px;
  }
  .label-index {
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    border: 1px solid #005aa0;
    border-radius: 24px;
    margin-right: 8px;
    font-weight: normal;
  }
  .label-tail {
    width: 160px;
    height: 12px;
    margin-left: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
}

.input-width {
  width: 260px;
}

.line {
  text-align: center;
}

.img-view {
  width: 196px;
  height: 104px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 3px;
  margin-bottom: 8px;
  .business-license {
    height: 100%;
    line-height: 86px;
    text-align: center;
    font-size: 24px;
    color: #999;
    background: rgba(0,0,0,0.05);
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// 查看大图
.larger-image-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  .mask-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
  }
  .image-view {
    position: absolute;
    top: 0;
    left: 25%;
    width: 50%;
    height: 100vh;
    margin: 0 auto;
    overflow: auto;
    padding: 20px 0;
    .image {
      display: block;
      width: 100%;
    }
  }
}
</style>
