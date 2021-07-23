<!-- 新增/修改弹窗 -->
<template>
  <div class="create-supplier">
    <el-form
      ref="rulesForm"
      :model="formData"
      size="small"
      label-width="150px"
      style="padding: 0 32px"
    >
      <el-page-header class="page-header" @back="goBack"></el-page-header>
      <el-form-item label-width="0px" class="label-title">
        <span>营业执照信息</span>
      </el-form-item>
      <el-form-item label="营业执照:" class="flex_half" style="margin-top: -30px;">
        <div class="img-view">
          <div class="business-license">
            <img v-if="formData.busiLicImg" :src="formData.busiLicImg" alt="营业执照">
            <i v-else class="el-icon-picture-outline"></i>
          </div>
        </div>
        <el-link @click="showLargerImage">点击查看大图<i class="el-icon-view el-icon--right"></i> </el-link>
      </el-form-item>
      <el-form-item class="flex_half" label="供应商全称:">
        <span>{{ formData.fullName }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="供应商地址:">
        <span>{{ formData.fullAddress }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="法人:">
        <span>{{ formData.legalPerson }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="统一社会信用代码:">
        <span>{{ formData.creditCode }}</span>
      </el-form-item>
      <el-form-item label-width="0px" class="label-title">
        <span>其他信息</span>
      </el-form-item>
      <el-form-item class="flex_half" label="联系人:" style="margin-top: -30px;">
        <span style="margin-right: 10px;">{{ formData.relation }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="联系人电话:">
        <span>{{ formData.relationPhone }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="业务联系人:">
        <span style="margin-right: 10px;">{{ formData.salePhone }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="商圈:">
        <span style="margin-right: 10px;">{{ formData.areaName }}</span>
      </el-form-item>
      <el-form-item v-if="false" class="flex_half" label="合同起止日期:">
        <span>{{ formData.contStartTime }} 至 {{ formData.contEndTime }}</span>
      </el-form-item>
      <el-form-item v-if="false" label="合同签订日期:">
        <span>{{ formData.contSignTime }}</span>
      </el-form-item>
      <el-form-item class="flex_half" label="创建人:">
        <span>{{ formData.creatorName || '--' }}</span>
      </el-form-item>
      <!-- <el-form-item class="flex_half" label="审核人:">
        <span>{{ formData.approver || '--' }}</span>
      </el-form-item> -->
    </el-form>
    <div v-if="showImage" class="larger-image-view">
      <div class="mask-layer" @click="showImage = false"></div>
      <div class="image-view">
        <img :src="formData.busiLicImg" class="image">
      </div>
    </div>
  </div>
</template>

<script>
import { Basic } from '@/api/base'

export default {
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
  mounted() {
    const vm = this
    vm.getSupplierInfo()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 获取供应商信息
    getSupplierInfo() {
      const vm = this
      const id = vm.$route.query.id
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
    showLargerImage() {
      this.showImage = true
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-form-item__label {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
.flex_half {
  margin-left: 120px;
}
.label-title {
  width: 150px;
  position: relative;
  z-index: 2;
  span {
    float: left;
    color: #333;
    font-size: 20px;
  }
}
/deep/ .el-form-item__content {
  color: rgba(0,0,0,0.45);
  font-size: 16px;
  line-height: 32px;
}
/deep/ .label-title {
  margin: 24px 0;
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
  margin-top: 8px;
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
.page-header {
  padding: 18px 24px;
  background: #fff;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #f5f5f5;
  padding-left: 0;
  margin-bottom: 24px;
}
/deep/ .el-page-header__content {
  font-size: 14px;
}
/deep/ .el-page-header__left::after {
  width: 0;
}
/deep/ .el-page-header__title {
  font-size: 20px;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
