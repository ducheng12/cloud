<!-- 新增/修改弹窗 -->
<template>
  <div class="create-supplier">
    <el-form
      ref="rulesForm"
      :model="formData"
      :rules="rules"
      size="small"
      label-width="140px"
      style="padding: 0 32px"
    >
      <el-page-header class="page-header" @back="goBack"></el-page-header>
      <el-form-item label-width="0px" class="label-title">
        <span class="label-index">1</span>
        <span>营业执照信息</span>
        <span class="label-tail"></span>
      </el-form-item>
      <el-form-item prop="busiLicImg" label="营业执照:">
        <div class="img-view">
          <div class="business-license">
            <img v-if="formData.busiLicImg" :src="formData.busiLicImg" alt="营业执照">
            <i v-else class="el-icon-picture-outline"></i>
          </div>
        </div>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :http-request="handlePreview"
          :show-file-list="false"
        >
          <el-button
            slot="trigger"
            size="small"
            plain
            icon="el-icon-plus"
          >添加营业执照</el-button>
          <div slot="tip" class="el-upload__tip">
            (说明:上传图片支持任意尺寸,大小不超过1M,仅支持jpg,jpeg,png图片格式)
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item class="flex_half" prop="fullName" label="供应商全称:">
        <el-input v-model.trim="formData.fullName" clearable class="input-width" placeholder="请输入供应商全称"></el-input>
      </el-form-item>
      <el-form-item class="flex_half" prop="region" label="供应商地区:">
        <el-cascader
          v-model="formData.region"
          placeholder="地区选择"
          :options="cityList"
          :props="{ expandTrigger: 'hover' }"
          class="input-width"
          clearable
          @change="handleArea"
        ></el-cascader>
      </el-form-item>
      <br />
      <el-form-item style="padding-right: 40px;" class="flex_half" prop="address" label="详细地址:">
        <el-input v-model.trim="formData.address" clearable placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item class="flex_half" prop="legalPerson" label="法人:">
        <el-input v-model.trim="formData.legalPerson" clearable class="input-width" placeholder="请输入法人姓名"></el-input>
      </el-form-item>
      <el-form-item prop="creditCode" label="统一社会信用代码:">
        <el-input v-model.trim="formData.creditCode" maxlength="18" clearable class="input-width" placeholder="社会信用代码"></el-input>
      </el-form-item>
      <el-form-item label-width="0px" class="label-title">
        <span class="label-index">2</span>
        <span>其他信息</span>
        <span class="label-tail"></span>
      </el-form-item>
      <el-form-item class="flex_half" prop="relation" label="联系人:">
        <el-input v-model.trim="formData.relation" clearable class="input-width" placeholder="请输入联系人姓名"></el-input>
      </el-form-item>
      <el-form-item class="flex_half" prop="relationPhone" label="联系人电话:">
        <el-input v-model.trim="formData.relationPhone" clearable class="input-width" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
      <br />
      <el-form-item class="flex_half" prop="salePhone" label="业务联系人电话:">
        <el-input v-model.trim="formData.salePhone" clearable class="input-width" placeholder="请输入业务联系人电话"></el-input>
      </el-form-item>
      <el-form-item class="flex_half flex_halfs" prop="areaId" label="商圈:">
        <el-select v-model="formData.areaId" size="small" style="width:260px;">
          <el-option
            v-for="item in areaNameList"
            :key="item.id"
            :label="item.areaName"
            :value="item.id"
            class="input-width"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item v-if="false" style="width:510px;" class="flex_half flex_halfs" label="合同起止日期:">
        <el-date-picker
          v-model="formData.daterange"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
          @change="handleDaterange"
        />
      </el-form-item>
      <el-form-item v-if="false" label="合同签订日期:">
        <el-date-picker
          v-model="formData.contSignTime"
          type="date"
          placeholder="开始日期"
          class="input-width"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item v-if="false" label="创建人:">
        <span>{{ formData.creatorName || '' }}</span>
      </el-form-item>
      <el-form-item v-if="false" label="审批人:">
        <span>{{ formData.approver || '' }}</span>
      </el-form-item>
    </el-form>
    <div class="cancel_confirm">
      <el-button size="small" @click="handleCancel">取 消</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { cityData } from '@/utils/cityData'
import { Basic } from '@/api/base'

export default {
  data() {
    return {
      contenTtitle: '新增供应商',
      supplierId: '',
      formData: {
        id: '',
        busiLicImg: '',
        fullName: '',
        region: [],
        province: '',
        city: '',
        district: '',
        address: '',
        legalPerson: '',
        creditCode: '',
        relation: '',
        relationPhone: '',
        contStartTime: '',
        daterange: [],
        contEndTime: '',
        contSignTime: '',
        creatorName: '',
        approver: '',
        areaId: '',
        salePhone: ''
      },
      rules: {
        busiLicImg: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        fullName: [
          { required: true, message: '请输入供应商全称', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的统一社会信用代码', trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        relationPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        salePhone: [
          { required: true, message: '请输入业务联系人电话', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择商圈', trigger: 'change' }
        ]
      },
      cityList: [],
      areaNameList: []
    }
  },
  watch: {},
  mounted() {
    const vm = this
    vm.cityList = cityData()
    Basic.general('supplier/areaList', {}).then(res => {
      this.areaNameList = res.data
    })
    if (vm.$route.query.id !== undefined) {
      vm.supplierId = vm.$route.query.id
      vm.contenTtitle = '编辑供应商'
      vm.getSupplierInfo()
    } else {
      vm.contenTtitle = '新增供应商'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
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
      const { province, city, district } = data
      vm.formData.province = province
      vm.formData.city = city
      vm.formData.district = district
      vm.formData.region = [province, city, district]
      vm.formData.address = data.address
      vm.formData.legalPerson = data.legalPerson
      vm.formData.creditCode = data.creditCode
      vm.formData.relation = data.relation
      vm.formData.areaId = data.areaId
      vm.formData.salePhone = data.salePhone
      vm.formData.relationPhone = data.relationPhone
      const { contStartTime, contEndTime } = data
      vm.formData.contStartTime = contStartTime
      vm.formData.contEndTime = contEndTime
      if (contStartTime && contEndTime) {
        vm.formData.daterange = [contStartTime, contEndTime]
      }
      vm.formData.contSignTime = data.contSignTime
      vm.formData.contEndTime = data.contEndTime
      vm.formData.creatorName = data.creatorName
      vm.formData.approver = data.approver
    },
    // 上传营业执照
    handlePreview(val) {
      const reg = /\.(png|jpg|jpeg)$/
      const vm = this
      if (!reg.test(val.file.name)) {
        vm.$message.error(' 图片格式不对！')
        return
      }
      if (parseInt(val.file.size) > (1024 * 1024)) {
        vm.$message.error(' 上传图片不能大于1M!')
        return
      }
      const formData = new FormData()
      formData.append('file', val.file)
      formData.append('path', 1)
      formData.append('useDay', 1)
      // const url = '/cloudApi/datacenter/file/uploadFile'
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
    // 选择合同起止日期
    handleDaterange(val) {
      const vm = this
      if (val !== null && val.length) {
        vm.formData.contStartTime = val[0]
        vm.formData.contEndTime = val[1]
      } else {
        vm.formData.contStartTime = ''
        vm.formData.contEndTime = ''
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleConfirm() {
      const vm = this
      const type = vm.$route.query.id === undefined ? 1 : 2
      switch (type) {
        case 1:
          // 新增
          vm.handleCreate()
          break
        case 2:
          // 编辑
          vm.handleEdit()
          break
        default:
          break
      }
    },

    // 新增
    handleCreate() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.formData))
      vm.$refs['rulesForm'].validate((valid) => {
        if (valid) {
          Basic.save('supplier', params).then(res => {
            vm.$message({
              showClose: true,
              message: '新增供应商成功！',
              type: 'success'
            })
            this.$router.go(-1)
          })
        } else {
          return false
        }
      })
    },
    // 编辑
    handleEdit() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.formData))
      vm.$refs['rulesForm'].validate((valid) => {
        if (valid) {
          Basic.update('supplier', params).then(res => {
            vm.$message({
              showClose: true,
              message: '保存供应商成功！',
              type: 'success'
            })
            this.$router.go(-1)
          })
        } else {
          return false
        }
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
      vm.formData.salePhone = ''
      vm.formData.areaId = ''
      vm.formData.relationPhone = ''
      vm.formData.contStartTime = ''
      vm.formData.contEndTime = ''
      vm.formData.daterange = []
      vm.formData.contSignTime = ''
      vm.formData.contEndTime = ''
      vm.formData.creatorName = ''
      vm.formData.approver = ''
      vm.$refs['rulesForm'].resetFields()
    }
  }
}
</script>
<style lang='scss' scoped>
.create-supplier /deep/ .dialog-view {
  width: 716px;
}
/deep/ .el-form-item__label {
  color: #000000;
}
.label-title {
  span {
    float: left;
    font-weight: bold;
  }
  /deep/ .el-form-item__content {
    // font-weight: bold;
    color: #333;
    font-size: 15px;
    line-height: 24px;
  }
  .label-index {
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    background: #005aa0;
    color: #ffffff;
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
.page-header {
  padding: 18px 24px;
  background: #fff;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #f5f5f5;
  padding-left:0;
}
.flex_half{
  // width:50%;
  // float: left;
  width:440px;
  display: inline-block;
}
.flex_halfs /deep/ input {
  width: 260px;
}
.cancel_confirm {
  // text-align: center;
  padding-left: 170px;
}
.page-header {
  margin-bottom: 24px;
}
/deep/ .el-page-header__title {
  font-size: 20px;
}
/deep/ .el-page-header__left::after {
  width: 0;
}
</style>
