<template>
  <div class="contont">
    <div>
      <el-page-header class="AddTitle" @back="$router.back()"></el-page-header>
    </div>
    <el-form ref="rulesForm" class="Mssg_form" size="small" label-position="top">
      <el-form-item label-width="0px" class="label-title">
        <span style=" color: black;">基本信息</span>
      </el-form-item>
      <div class="basic-mssg">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :required="true" class="fontWeig" label="供应商名称">
              <el-input v-model="baseInfoForm.supplierName" style="width:260px;" placeholder="请输入供应商全称" maxlength="60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="110" :required="true" class="my_form-item fontWeig" label="供应商简称">
              <el-input v-model="baseInfoForm.merchBasicInfo.shortName" style="width:260px" placeholder="请输入供应商简称" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="200" class="fontWeig" label="商圈" :required="true">
              <el-select v-model="baseInfoForm.businessId" style="width:260px;" placeholder="请选择">
                <el-option
                  v-for="item in areaNameList"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="110" label="供应商所在地" class="my_form-item fontWeig" :required="true">
              <el-cascader
                ref="cascaderAddr"
                v-model="region"
                style="width:260px"
                placeholder="地区选择"
                :options="cityList"
                :props="props"
                class="input-width"
                :required="true"
                clearable
                @change="handleArea"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="72" :required="true" label="详细地址" class="my_form-item fontWeig">
              <el-input v-model="baseInfoForm.merchBasicInfo.address" style="width:260px" maxlength="100" placeholder="请输入供应商详细地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="110" class="my_form-item fontWeig" label="业务联系人">
              <el-input v-model="baseInfoForm.contactName" style="width:260px" placeholder="请输入联系人" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label-width="72" :required="true" label="业务联系电话" class="my_form-item fontWeig">
              <el-input
                v-model="baseInfoForm.contactPhone"
                style="width:260px"
                placeholder="请输入联系人手机号码"
                maxlength="11"
                @blur="blurContPhone(1)"
              ></el-input>
              <div>该手机号作为懂衣供应商小程序登录账号，请正确填写</div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 资质信息 -->
      <el-form-item label-width="0px" class="label-title">
        <span style=" color: black;">资质信息</span>
      </el-form-item>
      <div class="basic-mssg">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="营业执照" class="fontWeig" style="display: inline-block;" :required="true">
              <MultipleUpload :limit="1" :image-list="licenceList" @handle-upload="UploadLicencePic" />
              <div style="margin-top:10px;">请上传营业执照，仅支持jpg或png格式</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人身份证（正面）" class="fontWeig" style="display: inline-block;" :required="true">
              <MultipleUpload :limit="1" :image-list="cardFrontList" @handle-upload="UploadCardFrontPic" />
              <div style="margin-top:10px;">请上传法人身份证，正面一张，仅支持jpg或png格式</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人身份证（反面）" class="fontWeig" style="display: inline-block;" :required="true">
              <MultipleUpload :limit="1" :image-list="cardBackList" @handle-upload="UploadCardBackPic" />
              <div style="margin-top:10px;">请上传法人身份证，反面一张，仅支持jpg或png格式</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-form-item label-width="200" class="fontWeig" label="统一社会信用代码" :required="true">
              <el-select v-model="baseInfoForm.merchAptitudeInfo.businessLicenseType" style="width:160px;" placeholder="请选择类型" :required="true">
                <el-option
                  v-for="item in papersList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item class="fontWeig" style="margin-top:32px">
              <el-input
                v-model="baseInfoForm.merchAptitudeInfo.businessLicenseNo"
                style="width:160px;"
                maxlength="20"
                placeholder="请输入证件编号"
                @input="imputMerchSettInfo($event,4)"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="fontWeig" label-width="110" label="法人身份证号" :required="true">
              <el-input
                v-model="baseInfoForm.merchContactInfo.contactIdCard"
                style="width:260px;"
                placeholder="请输入法人身份证号"
                maxlength="18"
                @input="imputMerchSettInfo($event,3)"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item class="fontWeig" label="名称" :required="true">
              <el-input
                v-model="baseInfoForm.merchAptitudeInfo.licenseMainName"
                style="width:260px;"
                maxlength="30"
                placeholder="请输入证件主体名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="72" class="fontWeig" label=" 法人姓名" :required="true">
              <el-input v-model="baseInfoForm.merchContactInfo.contactName" style="width:260px;" placeholder="请输入法人姓名" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item class="fontWeig" label="地址" :required="true">
              <el-input
                v-model="baseInfoForm.merchAptitudeInfo.licenseRegisterAddress"
                style="width:260px;"
                maxlength="100"
                placeholder="请输入证件地址"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="fontWeig" label-width="110" label="法人联系电话" :required="true">
              <el-input
                v-model="baseInfoForm.merchContactInfo.contactPhone"
                style="width:260px;"
                placeholder="请输入法人联系电话"
                maxlength="11"
                @blur="blurContPhone(3)"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 银行信息 -->
      <el-form-item label-width="0px" class="label-title">
        <span style=" color: black;">银行信息</span>
      </el-form-item>
      <div class="basic-mssg">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="72" :required="true" class="fontWeig" label="银行账号" maxlength="30">
              <el-input
                v-model="baseInfoForm.merchSettInfo.bankAccountNo"
                style="width:260px;"
                placeholder="请输入供应商银行卡账号"
                @input="bankAccountNo"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="110" :required="true" class="my_form-item fontWeig" label="开户名称">
              <el-input v-model="baseInfoForm.merchSettInfo.bankAccountName" style="width:260px" placeholder="请输入开户名" maxlength="40"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="200" class="fontWeig" :required="true" label="开户行">
              <el-input v-model="baseInfoForm.merchSettInfo.bankAccountAddress" style="width:260px" placeholder="请输入开户行" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="110" label="开户行身份证" class="fontWeig" :required="true">
              <el-input
                v-model="baseInfoForm.merchSettInfo.bankIdCardNo"
                style="width:260px"
                placeholder="请输入开户行身份证"
                maxlength="18"
                @input="imputMerchSettInfo($event,1)"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="72" :required="true" label="开户行联行号" class="fontWeig">
              <el-input
                v-model="baseInfoForm.merchSettInfo.bankAccountLineNo"
                style="width:260px"
                placeholder="请输入开户行联行号"
                maxlength="20"
                @input="imputMerchSettInfo($event,2)"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="72" :required="true" label="银行预留电话" class="my_form-item fontWeig">
              <el-input
                v-model="baseInfoForm.merchSettInfo.bankPreMobile"
                style="width:260px"
                placeholder="请输入银行预留电话"
                maxlength="11"
                @blur="blurContPhone(2)"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 供应商信息 -->
      <el-form-item label-width="0px" class="label-title">
        <span style=" color: black;">供应商信息</span>
      </el-form-item>
      <div class="basic-mssg">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="门户照片" class="fontWeig" style="display: inline-block;" :required="true">
              <MultipleUpload :limit="1" :image-list="doorHeadList" @handle-upload="UploadDoorHeadPic" />
              <div style="margin-top:10px;">请上传门户照片，仅支持jpg或png格式</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营场所照片" class="fontWeig" style="display: inline-block;" :required="true">
              <MultipleUpload :limit="1" :image-list="businessList" @handle-upload="UploadBusinessPic" />
              <div style="margin-top:10px;">请上传经营场所照片，仅支持jpg或png格式</div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 其他信息 -->
      <el-form-item label-width="0px" class="label-title">
        <span style=" color: black;">其他信息</span>
      </el-form-item>
      <div class="basic-mssg">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="72" label="创建人" class="my_form-item fontWeig">
              <el-input v-model="creatorName" style="width:260px;" :disabled="true" placeholder="请输入创建人"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="baseInfoForm.supplierId" :span="8">
            <el-form-item label-width="72" label="入驻审核状态" class="my_form-item fontWeig">
              <el-tag v-if="submitStatus === 0" type="info">待审核</el-tag>
              <el-tag v-if="submitStatus === 1" type="success">审核通过</el-tag>
              <el-tag v-if="submitStatus === 2" type="danger">审核驳回</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item style="text-align:center">
        <!-- <el-button v-if="!baseInfoForm.supplierId" style="width:65px;" size="small" type="primary" @click="handleCancel">保 存</el-button> -->
        <el-button v-if="submitStatus === 2 || submitStatus === '' " style="width:65px;margin-right: 20px;margin-left:-290px;" size="small" type="primary" @click="handleConfirm">保 存</el-button>
        <el-button v-if="false" type="primary" size="small" @click="handleConfirm">提交审核</el-button>
        <el-button type="primary" size="small" @click="$router.back()">{{ submitStatus === 2 || submitStatus === '' ? '取 消' : '返 回' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { cityData } from '@/utils/cityData'
import { Basic } from '@/api/base'
import MultipleUpload from '@/components/MultipleUploads'
export default {
  components: { MultipleUpload },
  props: {
    storeId: {
      type: String,
      default: ''
    },
    goodsAddid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submitStatus: '',
      props: {
        value: 'value',
        label: 'label',
        expandTrigger: 'hover'
      },
      papersList: [ // 证件类型
        { label: '营业执照', value: 'NATIONAL_LEGAL' },
        { label: '营业执照多证合一', value: 'NATIONAL_LEGAL_MERGE' },
        { label: '事业单位法人证书', value: 'INST_RGST_CTF' }
      ],
      areaNameList: [], // 商圈数据
      // storeBannerImgCount: 5, // 图片上传数量
      goodsProperty: [],
      creatorName: '',
      treeData: [], // 一级分类数据
      baseInfoForm: {
        businessId: '', // 商圈id
        contactName: '', // 业务联系人
        contactPhone: '', // 业务联系人电话
        creatorId: this.$store.state.user.userId, // 创建人id
        provinceCode: '', // 国标省code
        cityCode: '', // 国标市code
        districtCode: '', // 国标区code
        address: '', // 详细地址
        supplierName: '', // 供应商名称
        merchAptitudeInfo: { // 商户资质资料
          businessLicenseType: '', // 证件编号类型
          businessLicenseNo: '', // 证件编号
          legalPerson: '', // 法人姓名
          licenseMainName: '', // 证件主体名称
          licenseRegisterAddress: '' // 证件注册地址
        },
        merchBasicInfo: { // 商户基本资料
          shortName: '', // 商户简称
          province: '', // 省区编码,
          city: '', // 市区编码
          district: '', // 城区编码
          servicePhone: '',
          address: '' // 详细地址
        },
        merchContactInfo: { // 商户联系人资料
          contactIdCard: '', // 法人身份证号
          contactName: '', // 法人姓名
          contactPhone: '' // 法人电话
        },
        merchFileInfo: { // 商户资质文件信息
          businessPic: '', // 经营场所
          cardFrontPic: '', // 法人身份证正面照
          cardBackPic: '', // 法人身份证反面
          doorHeadPic: '', // 门户照片
          licencePic: '' // 营业执照
        },
        merchSettInfo: { // 商户结算卡资料
          bankAccountAddress: '', // 开户行地址
          bankAccountNo: '', // 银行账号
          bankAccountName: '', // 开户名称
          bankIdCardNo: '', // 开户身份证号
          bankAccountLineNo: '', // 开户行联行号
          bankPreMobile: '' // 银行预留电话
        }
      },
      businessList: [], // 经营场所图片回显
      cardFrontList: [], // 法人身份证正面照图片回显
      cardBackList: [], // 法人身份证反面照图片回显
      doorHeadList: [], // 门户照图片回显
      licenceList: [], // 营业执照图片回显
      region: [] // 省市区
    }
  },
  created() {
    const vm = this
    vm.cityList = cityData()
    if (this.$route.query.id) {
      this.creatorName = ''
      this.queryGoods(this.$route.query.id)
    } else {
      this.creatorName = this.$store.state.user.name
    }
    vm.getBusiness()
  },
  methods: {
    // 获取商圈
    getBusiness() {
      const vm = this
      Basic.general('supplier/areaList', {}).then(res => {
        vm.areaNameList = res.data
      })
    },
    // 身份证正面上传成功
    UploadCardFrontPic(val) {
      const vm = this
      vm.baseInfoForm.merchFileInfo.cardFrontPic = val.map(t => t.fileUrl).join(',')
    },
    // 身份证反面上传成功
    UploadCardBackPic(val) {
      const vm = this
      vm.baseInfoForm.merchFileInfo.cardBackPic = val.map(t => t.fileUrl).join(',')
    },
    // 营业执照上传成功
    UploadLicencePic(val) {
      const vm = this
      vm.baseInfoForm.merchFileInfo.licencePic = val.map(t => t.fileUrl).join(',')
    },
    // 门户照片上传成功
    UploadDoorHeadPic(val) {
      const vm = this
      vm.baseInfoForm.merchFileInfo.doorHeadPic = val.map(t => t.fileUrl).join(',')
    },
    // 经营场所上传成功
    UploadBusinessPic(val) {
      const vm = this
      vm.baseInfoForm.merchFileInfo.businessPic = val.map(t => t.fileUrl).join(',')
    },
    // 查询商品
    async queryGoods(id) {
      const params = {
        supplierId: id
      }
      const vm = this
      await Basic.general('supplier/detail', params).then(res => {
        if (res.code === 200) {
          const {
            merchantSettleInfo, createUser, contactName, contactPhone, supplierName,
            provinceCode, cityCode, districtCode, businessId, supplierId, verifyStatus } = res.data
          this.baseInfoForm.supplierId = supplierId
          vm.creatorName = createUser // 创建人
          vm.baseInfoForm.contactName = contactName // 业务联系人
          vm.baseInfoForm.contactPhone = contactPhone // 业务联系人电话
          vm.baseInfoForm.supplierName = supplierName // 供应商名称
          vm.baseInfoForm.provinceCode = provinceCode // 省code
          vm.baseInfoForm.cityCode = cityCode // 市code
          vm.baseInfoForm.districtCode = districtCode // 供应商名称
          vm.region = [provinceCode, cityCode, districtCode] // 回显地区
          vm.baseInfoForm.businessId = businessId + '' // 商圈id
          if (verifyStatus === 0) {
            vm.submitStatus = 0
          }
          if (verifyStatus === 1) {
            vm.submitStatus = 1
          }
          if (verifyStatus === 2) {
            vm.submitStatus = 2
          }
          // 商户资质资料
          vm.baseInfoForm.merchAptitudeInfo.businessLicenseNo = merchantSettleInfo.merchAptitudeInfo.businessLicenseNo // 证件编号
          vm.baseInfoForm.merchAptitudeInfo.businessLicenseType = merchantSettleInfo.merchAptitudeInfo.businessLicenseType // 证件编号类型
          vm.baseInfoForm.merchAptitudeInfo.legalPerson = merchantSettleInfo.merchAptitudeInfo.legalPerson // 法人姓名
          vm.baseInfoForm.merchAptitudeInfo.licenseMainName = merchantSettleInfo.merchAptitudeInfo.licenseMainName // 证件主体名称
          vm.baseInfoForm.merchAptitudeInfo.licenseRegisterAddress = merchantSettleInfo.merchAptitudeInfo.licenseRegisterAddress // 证件注册地址
          // 商户基本资料
          vm.baseInfoForm.merchBasicInfo.address = merchantSettleInfo.merchBasicInfo.address // 详细地址
          vm.baseInfoForm.merchBasicInfo.province = merchantSettleInfo.merchBasicInfo.province // 省区编码
          vm.baseInfoForm.merchBasicInfo.city = merchantSettleInfo.merchBasicInfo.city // 市区编码
          vm.baseInfoForm.merchBasicInfo.district = merchantSettleInfo.merchBasicInfo.district // 市区编码
          vm.baseInfoForm.merchBasicInfo.shortName = merchantSettleInfo.merchBasicInfo.shortName // 商户简称
          // 商户联系人资料
          vm.baseInfoForm.merchContactInfo.contactName = merchantSettleInfo.merchContactInfo.contactName // 法人姓名
          vm.baseInfoForm.merchContactInfo.contactPhone = merchantSettleInfo.merchContactInfo.contactPhone // 法人电话
          vm.baseInfoForm.merchContactInfo.contactIdCard = merchantSettleInfo.merchContactInfo.contactIdCard // 法人身份证号
          // 商户资质文件信息
          vm.baseInfoForm.merchFileInfo.businessPic = merchantSettleInfo.merchFileInfo.businessPic // 经营场所
          vm.baseInfoForm.merchFileInfo.cardBackPic = merchantSettleInfo.merchFileInfo.cardBackPic // 法人身份证反面
          vm.baseInfoForm.merchFileInfo.cardFrontPic = merchantSettleInfo.merchFileInfo.cardFrontPic // 法人身份证正面照
          vm.baseInfoForm.merchFileInfo.doorHeadPic = merchantSettleInfo.merchFileInfo.doorHeadPic // 门户照片
          vm.baseInfoForm.merchFileInfo.licencePic = merchantSettleInfo.merchFileInfo.licencePic // 营业执照
          // 回显图片
          vm.businessList.push(merchantSettleInfo.merchFileInfo.businessPic) // 经营场所图片回显
          vm.cardFrontList.push(merchantSettleInfo.merchFileInfo.cardFrontPic) // 法人身份证正面照图片回显
          vm.cardBackList.push(merchantSettleInfo.merchFileInfo.cardBackPic) // 法人身份证反面照图片回显
          vm.doorHeadList.push(merchantSettleInfo.merchFileInfo.doorHeadPic) // 门户照图片回显
          vm.licenceList.push(merchantSettleInfo.merchFileInfo.licencePic) // 营业执照图片回显
          // 商户结算卡资料
          vm.baseInfoForm.merchSettInfo.bankAccountAddress = merchantSettleInfo.merchSettInfo.bankAccountAddress // 开户行地址
          vm.baseInfoForm.merchSettInfo.bankAccountName = merchantSettleInfo.merchSettInfo.bankAccountName // 开户名称
          vm.baseInfoForm.merchSettInfo.bankAccountNo = merchantSettleInfo.merchSettInfo.bankAccountNo // 银行账号
          vm.baseInfoForm.merchSettInfo.bankPreMobile = merchantSettleInfo.merchSettInfo.bankPreMobile // 银行预留电话
          vm.baseInfoForm.merchSettInfo.bankIdCardNo = merchantSettleInfo.merchSettInfo.bankIdCardNo // 开户身份证号
          vm.baseInfoForm.merchSettInfo.bankAccountLineNo = merchantSettleInfo.merchSettInfo.bankAccountLineNo // 开户行联行号
        }
      })
    },
    // 地区选择
    handleArea(val) {
      const vm = this
      const arr = vm.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
      vm.baseInfoForm.merchBasicInfo.province = arr[0] // 中文省
      vm.baseInfoForm.merchBasicInfo.city = arr[1] // 中文市
      vm.baseInfoForm.merchBasicInfo.district = arr[2] // 中文区

      vm.baseInfoForm.provinceCode = parseInt(val[0]) // 国标省code
      vm.baseInfoForm.cityCode = parseInt(val[1]) // 国标市code
      vm.baseInfoForm.districtCode = parseInt(val[2]) // 国标区code
    },
    addDevice() {
      const num = /^[0-9]+$/
      if (this.baseInfoForm.mirrorNos.indexOf(this.mirrorNos) !== -1) {
        this.$message.warning('绑定设备ID不能相同！')
        return
      }
      if (this.mirrorNos !== '' && num.test(this.mirrorNos)) {
        this.baseInfoForm.mirrorNos.push(this.mirrorNos)
        this.mirrorNos = ''
      } else {
        this.$message.warning('输入框不能为空，且只能为数字！')
      }
    },
    // 表单验证
    getVerify() {
      const vm = this
      const {
        merchBasicInfo, businessId, contactPhone, merchSettInfo, merchFileInfo,
        merchContactInfo, merchAptitudeInfo, supplierName } = vm.baseInfoForm
      if (!supplierName) {
        vm.$message.warning('供应商名称不能为空！')
        return false
      }
      if (!merchBasicInfo.shortName) {
        vm.$message.warning('供应商简称不能空！')
        return false
      }
      if (!businessId) {
        vm.$message.warning('请选择商圈！')
        return false
      }
      if (!merchBasicInfo.province && !merchBasicInfo.city && !merchBasicInfo.district) {
        vm.$message.warning('请选择供应商所在地！')
        return false
      }
      if (!merchBasicInfo.address) {
        vm.$message.warning('详细地址不能为空！')
        return false
      }
      if (!contactPhone) {
        vm.$message.warning('业务联系电话不能为空！')
        return false
      }
      if (!merchFileInfo.licencePic) {
        vm.$message.warning('请上传营业执照！')
        return false
      }
      if (!merchFileInfo.cardFrontPic) {
        vm.$message.warning('请上传身份证正面！')
        return false
      }
      if (!merchFileInfo.cardBackPic) {
        vm.$message.warning('请上传身份证反面！')
        return false
      }
      if (!merchAptitudeInfo.businessLicenseType) {
        vm.$message.warning('请选择证件类型！')
        return false
      }
      if (!merchAptitudeInfo.businessLicenseNo) {
        vm.$message.warning('证件编号不能为空！')
        return false
      }
      if (!merchContactInfo.contactIdCard) {
        vm.$message.warning('法人身份证号不能为空！')
        return false
      }
      if (!merchAptitudeInfo.licenseMainName) {
        vm.$message.warning('证件主体名称不能为空！')
        return false
      }
      if (!merchContactInfo.contactName) {
        vm.$message.warning('法人姓名不能为空！')
        return false
      }
      if (!merchAptitudeInfo.licenseRegisterAddress) {
        vm.$message.warning('证件注册地址不能为空！')
        return false
      }
      if (!merchContactInfo.contactPhone) {
        vm.$message.warning('法人联系电话不能为空！')
        return false
      }
      if (!merchSettInfo.bankAccountNo) {
        vm.$message.warning('银行账号不能为空！')
        return false
      }
      if (!merchSettInfo.bankAccountName) {
        vm.$message.warning('开户名称不能为空！')
        return false
      }
      if (!merchSettInfo.bankAccountAddress) {
        vm.$message.warning('开户行不能为空！')
        return false
      }
      if (!merchSettInfo.bankIdCardNo) {
        vm.$message.warning('开户行身份证不能为空！')
        return false
      }
      if (!merchSettInfo.bankAccountLineNo) {
        vm.$message.warning('开户行联行号不能为空！')
        return false
      }
      if (!merchSettInfo.bankPreMobile) {
        vm.$message.warning('银行预留电话不能为空！')
        return false
      }
      if (!merchFileInfo.doorHeadPic) {
        vm.$message.warning('请上传门户照片！')
        return false
      }
      if (!merchFileInfo.businessPic) {
        vm.$message.warning('请上传经营场所照片！')
        return false
      }
      return true
    },
    // 业务联系人电话blur事件
    blurContPhone(num) {
      const vm = this
      const phone = /^1[3|5|7|8|9]\d{9}$/
      if (num === 1) {
        if (vm.baseInfoForm.contactPhone !== '' && !phone.test(vm.baseInfoForm.contactPhone)) {
          this.$message.warning({ message: '手机号码格式不正确', type: 'error' })
          return
        }
      }
      if (num === 2) {
        if (vm.baseInfoForm.merchSettInfo.bankPreMobile !== '' && !phone.test(vm.baseInfoForm.merchSettInfo.bankPreMobile)) {
          this.$message.warning({ message: '手机号码格式不正确', type: 'error' })
          return
        }
      }
      if (num === 3) {
        if (vm.baseInfoForm.merchContactInfo.contactPhone !== '' && !phone.test(vm.baseInfoForm.merchContactInfo.contactPhone)) {
          this.$message.warning({ message: '手机号码格式不正确', type: 'error' })
          return
        }
      }
    },
    // 银行账号input事件
    bankAccountNo(e) {
      this.baseInfoForm.merchSettInfo.bankAccountNo = e.replace(/[^\d]/g, '')
    },
    // 省份证input事件---开户行联行号---法人身份证--证件编号
    imputMerchSettInfo(e, num) {
      console.log(e, num)
      if (num === 1) {
        this.baseInfoForm.merchSettInfo.bankIdCardNo = e.replace(/[^\w\/]/ig, '')
      }
      if (num === 2) {
        this.baseInfoForm.merchSettInfo.bankAccountLineNo = e.replace(/[^\w\/]/ig, '')
      }
      if (num === 3) {
        this.baseInfoForm.merchContactInfo.contactIdCard = e.replace(/[^\w\/]/ig, '')
      }
      if (num === 4) {
        this.baseInfoForm.merchAptitudeInfo.businessLicenseNo = e.replace(/[^\w\/]/ig, '')
      }
    },
    // 保存（审核，新增，编辑）
    handleConfirm() {
      const vm = this
      if (!vm.getVerify()) {
        return false
      }
      vm.baseInfoForm.address = vm.baseInfoForm.merchBasicInfo.address // 详细地址赋值
      vm.baseInfoForm.merchAptitudeInfo.legalPerson = vm.baseInfoForm.contactName // 商户资质资料里的法人姓名赋值
      vm.baseInfoForm.merchBasicInfo.servicePhone = vm.baseInfoForm.contactPhone // 商户资质资料里的法人姓名赋值
      if (this.$route.query.id) {
        Basic.normal('supplier/update', this.baseInfoForm).then(res => {
          if (res.code === 200) {
            vm.$message({ message: '编辑成功', type: 'success' })
            this.$router.go(-1)
          }
        })
      } else {
        Basic.normal('supplier/create', this.baseInfoForm).then(res => {
          vm.$message({ message: '新增成功', type: 'success' })
          this.$router.go(-1)
        })
      }
    },
    // 新建保存
    handleCancel() {
      const vm = this
      const {
        merchBasicInfo, businessId, contactPhone, supplierName } = vm.baseInfoForm
      if (!supplierName) {
        vm.$message.warning('供应商名称不能为空！')
        return false
      }
      if (!merchBasicInfo.shortName) {
        vm.$message.warning('供应商简称不能空！')
        return false
      }
      if (!businessId) {
        vm.$message.warning('请选择商圈！')
        return false
      }
      if (!merchBasicInfo.province && !merchBasicInfo.city && !merchBasicInfo.district) {
        vm.$message.warning('请选择供应商所在地！')
        return false
      }
      if (!merchBasicInfo.address) {
        vm.$message.warning('详细地址不能为空！')
        return false
      }
      if (!contactPhone) {
        vm.$message.warning('业务联系电话不能为空！')
        return false
      }
      Basic.normal('supplier/create', this.baseInfoForm).then(res => {
        vm.$message({ message: '保存成功', type: 'success' })
        this.$router.go(-1)
      })
    },
    // 删除云镜
    deleteDevice(v) {
      const vm = this
      this.baseInfoForm.mirrorNos.forEach((t, i) => {
        if (t === v) {
          this.baseInfoForm.mirrorNos.splice(i, 1)
          vm.$message.warning('删除当前设备，保存成功后生效！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label{
  padding:0 !important;
}
.AddTitle{
  margin:20px;
  /deep/ .el-page-header__left::after{
    width:0;
  }
  /deep/  .el-page-header__title{
  font-size: 20px;
}
}
.Mssg_form{
  padding: 20px 48px;
}
.basic-mssg{
  margin:0px 0 50px 30px;
}
.text-end {
  font-size: 14px;
  line-height: 33px;
}
.full-width {
  width: 100%;
  line-height: 33px;
}
.el-icon-circle-close {
  font-size: 24px;
  position: relative;
  bottom: 134px;
  left: 122px;
  color: white;
}
.el-icon-circle-close:hover {
  background: #323842;
  border-radius: 50%;
}
/* input numbel属性去除上下按键 */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/* 小模块标题 */
.label-title {
  span {
    float: left;
    font-weight: bold;
    font-size: 18px;
  }
  /deep/ .el-form-item__content {
    // font-weight: bold;
    color: white;
    font-size: 15px;
    line-height: 24px;
  }
}
.fontWeig {
  width:100%;
}
.fontWeig /deep/ .el-form-item__label {
  font-weight:400;
  display:inline-block;
  // text-align:right;
  width:240px;
}
.imgPa{
  padding-left:120px;
  margin-top: 10px;
}
.addBtn{
  border:0;
  color:#1890FF;
}
.delBtn{
  border:0;
  color:#FF4D4F;
}
.uploader {
  overflow: hidden;
  margin-top: 8px;
}
</style>
