<template>
  <div>
    <div>
      <el-form ref="rulesForm" class="Mssg_form" size="small" label-width="80px">
        <el-form-item label-width="0px" class="label-title">
          <span class="label-index">1</span>
          <span style=" color: black;">基本信息</span>
          <span class="label-tail"></span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label-width="72" :required="true" class="fontWeig" label="云店名称：">
              <el-input v-model="baseInfoForm.name" style="width:260px;" placeholder="请输入云店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="110" :required="true" class="my_form-item fontWeig" label="主要联系人：">
              <el-input
                v-model="baseInfoForm.relation"
                style="width:260px"
                placeholder="请输入联系人"
                maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label-width="72" :required="true" label="手机号码：" class="my_form-item fontWeig">
              <el-input
                v-model="baseInfoForm.relationPhone"
                style="width:260px"
                :disabled="addEdit"
                placeholder="请输入手机号码"
                axlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="110" label="云店所在地：" class="my_form-item fontWeig" :required="true">
              <el-cascader
                v-model="baseInfoForm.region"
                style="width:260px"
                placeholder="地区选择"
                :options="cityList"
                :props="{ expandTrigger: 'hover' }"
                class="input-width"
                :required="true"
                clearable
                @change="handleArea"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label-width="72" :required="true" label="云店地址：" class="my_form-item fontWeig">
              <el-input
                v-model="baseInfoForm.address"
                style="width:260px"
                placeholder="云店详细地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="200" class="fontWeig" label="主营类目：">
              <el-select
                v-model="baseInfoForm.mainType"
                style="width:260px;"
                placeholder="主营类别"
              >
                <el-option :label="'女装'" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <h4>购买设置</h4> -->
    <div>
      <el-form size="small" class="Mssg_form">
        <el-form-item label-width="0px" class="label-title">
          <span class="label-index">2</span>
          <span style=" color: black;">营业执照信息</span>
          <span class="label-tail"></span>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label-width="72" class="fontWeig" label=" 法人姓名：">
              <el-input
                v-model="baseInfoForm.legalPerson"
                style="width:260px;"
                placeholder="请输入法人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item class="fontWeig" label-width="110" label="法人联系电话:">
              <el-input
                v-model="baseInfoForm.legalPhone"
                style="width:260px;"
                placeholder="请输入法人联系电话"
                maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              label="营业执照："
              class="fontWeig"
              style="display: inline-block;"
              :required="true"
            >
              <MultipleUpload :limit="1" :image-list="businessBannerImgList" @handle-upload="busUpload" />
              <div class="imgPa">上传图片支持任意尺寸，大小不超过1M，仅支持jpg，jpeg，png图片格式</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              label="云店照片："
              class="fontWeig"
              style="display: inline-block;"
              :required="true"
            >
              <MultipleUpload :limit="5" :image-list="storeBannerImgList" @handle-upload="storeUpload" />
              <div class="imgPa">上传图片支持任意尺寸，大小不超过1M，仅支持jpg，jpeg，png图片格式</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              label="法人身份证（正反面）："
              class="fontWeig"
              style="display: inline-block;"
              :required="true"
            >
              <MultipleUpload :limit="2" :image-list="legalPersonImgList" @handle-upload="handleUpload" />
              <div class="imgPa">上传图片支持任意尺寸，大小不超过1M，仅支持jpg，jpeg，png图片格式</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <h4>商品展示</h4> -->
    <el-form class="Mssg_form">
      <el-form-item label-width="0px" class="label-title">
        <span class="label-index">3</span>
        <span style=" color: black;">云镜信息</span>
        <span class="label-tail"></span>
      </el-form-item>
      <el-form-item v-for="(item,index) in baseInfoForm.mirrorNos" :key="index" label="设备ID：" class="my_form-item fontWeig">
        <el-input
          v-model="baseInfoForm.mirrorNos[index]"
          :disabled="true"
          style="width:260px;"
          :value="item"
          placeholder="请输入设备ID"
          maxlength="30"
        >
        </el-input>
        <el-button class="delBtn" @click="deleteDevice(item)">删除</el-button>
      </el-form-item>
      <el-form-item label-width="72" label="设备ID：" class="my_form-item fontWeig">
        <el-input
          v-model="mirrorNos"
          style="width:260px;"
          placeholder="请输入设备ID"
          maxlength="30"
        ></el-input>
        <el-button class="addBtn" @click="addDevice">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- <h4>商品详情</h4> -->
    <div style="margin-top:20px;">
      <el-form class="Mssg_form">
        <el-form-item label-width="0px" class="label-title">
          <span class="label-index">4</span>
          <span style=" color: black;">其他信息</span>
          <span class="label-tail"></span>
        </el-form-item>
        <el-form-item label-width="72" label="创建人：" class="my_form-item fontWeig">
          <el-input
            v-model="creatorName"
            style="width:260px;"
            :disabled="true"
            placeholder="请输入创建人"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-form>
      <el-form-item style="text-align:center">
        <el-button style="width:65px;" size="small" @click="handleCancel">取 消</el-button>
        <el-button style="width:65px;margin-left: 72px;" type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { cityData } from '@/utils/cityData'
import { Basic } from '@/api/base'
import MultipleUpload from '@/components/MultipleUpload'
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
      // storeBannerImgCount: 5, // 图片上传数量
      goodsProperty: [],
      creatorName: '',
      addEdit: false,
      treeData: [], // 一级分类数据
      baseInfoForm: {
        name: '', // 门店名称
        relation: '', // 主要联系人
        relationPhone: '', // 手机号码
        province: '', // 省区编码
        city: '', // 市区编码
        district: '', // 城区编码
        address: '', // 详细地址
        mainType: '', // 主营类目
        legalPerson: '', // 法人姓名
        legalPhone: '', // 法人联系电话
        busiLicImg: [], // 营业执照
        shopImgs: '', // 门店照片
        legalIdCardImgs: '', // 法定人身份证（正反面）
        mirrorNos: [], // 设备Id

        creatorId: 1, // 创建人id
        fileList: [] // 商品图片列表
      },
      imgUrlList: [],
      businessBannerImgList: [], // 营业执照
      storeBannerImgList: [], // 门店
      legalPersonImgList: [], // 法人
      cityList: [],
      region: [],
      mirrorNos: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      this.creatorName = ''
      this.addEdit = true
      this.title = '编辑云店'
    } else {
      this.creatorName = this.$store.state.user.name
    }
    if (this.$route.query.id) {
      this.queryGoods(this.$route.query.id)
    }
  },
  mounted() {
    const vm = this
    vm.cityList = cityData()
  },
  methods: {
    // 多图片上传
    handleUpload(val) {
      const vm = this
      vm.legalPersonImgList = val.map(t => t.fileUrl)
    },
    busUpload(val) {
      const vm = this
      vm.businessBannerImgList = val.map(t => t.fileUrl)
    },
    storeUpload(val) {
      const vm = this
      vm.storeBannerImgList = val.map(t => t.fileUrl)
    },
    // 查询商品
    async queryGoods(id) {
      const params = {
        id: id
      }
      const vm = this
      await Basic.normal('shop/info', params).then(res => {
        if (res.code === 200) {
          this.baseInfoForm.name = res.data.name
          this.baseInfoForm.relation = res.data.relation
          this.baseInfoForm.relationPhone = res.data.relationPhone
          this.baseInfoForm.region = [res.data.province, res.data.city, res.data.district]
          vm.baseInfoForm.province = res.data.province
          vm.baseInfoForm.city = res.data.city
          vm.baseInfoForm.district = res.data.district
          this.baseInfoForm.address = res.data.address
          this.baseInfoForm.mainType = res.data.mainType
          this.baseInfoForm.legalPerson = res.data.legalPerson
          this.baseInfoForm.legalPhone = res.data.legalPhone
          this.baseInfoForm.busiLicImg = res.data.busiLicImg
          const arrBus = [res.data.busiLicImg]
          if (res.data.busiLicImg == null) {
            arrBus.length = 0
            this.businessBannerImgList = arrBus
          }
          this.businessBannerImgList = arrBus.map(x => {
            // 回显图片
            return x
          })

          this.baseInfoForm.shopImgs = res.data.shopImgs // 门店照片
          this.storeBannerImgList = res.data.shopImgs.map(x => {
            // 回显图片
            return x
          })
          this.baseInfoForm.legalIdCardImgs = res.data.legalIdCardImgs // 法定人身份证（正反面）
          this.legalPersonImgList = res.data.legalIdCardImgs.map(x => {
            // 回显图片
            return x
          })
          this.baseInfoForm.mirrorNos = res.data.mirrorNos
          this.baseInfoForm.creatorId = res.data.creatorId
          vm.creatorName = res.data.creatorName
          this.baseInfoForm.fileList = res.data.fileList
        }
      })
    },
    // 地区选择
    handleArea(val) {
      const vm = this
      vm.baseInfoForm.province = parseInt(val[0])
      vm.baseInfoForm.city = parseInt(val[1])
      vm.baseInfoForm.district = parseInt(val[2])
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
    // 保存
    handleConfirm() {
      const vm = this
      this.baseInfoForm.busiLicImg = this.businessBannerImgList[0]
      this.baseInfoForm.shopImgs = this.storeBannerImgList
      this.baseInfoForm.legalIdCardImgs = this.legalPersonImgList
      const tPhone = /^1[3|5|7|8|9]\d{9}$/
      const tMname = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
      if (!tMname.test(this.baseInfoForm.name)) {
        vm.$message.warning('云店名称不能含有特殊字符，且不能为空！')
        return
      }
      if (!tMname.test(this.baseInfoForm.relation)) {
        vm.$message.warning('主要联系人不能含有特殊字符，且不能为空！')
        return
      }
      if (!tPhone.test(this.baseInfoForm.relationPhone)) {
        vm.$message.warning('手机号码格式不对！')
        return
      }
      if (!tMname.test(this.baseInfoForm.address)) {
        vm.$message.warning('云店详细地址不能含有特殊字符，且不能为空！')
        return
      }
      if (this.baseInfoForm.legalPerson) {
        if (!tMname.test(this.baseInfoForm.legalPerson)) {
          vm.$message.warning('法人姓名不能含有特殊字符，且不能为空！')
          return
        }
      }
      if (this.baseInfoForm.legalPhone) {
        if (!tPhone.test(this.baseInfoForm.legalPhone)) {
          vm.$message.warning('法人联系电话格式不对！')
          return
        }
      }
      if (this.businessBannerImgList.length === 0) {
        // 营业执照
        vm.$message.warning('营业执照照片不能为空！')
      }
      if (this.storeBannerImgList.length === 0) {
        // 门店
        vm.$message.warning('云店照片不能为空！')
      }
      if (this.legalPersonImgList.length === 0) {
        // 法人
        vm.$message.warning('法人身份证照片不能为空！')
      }
      if (this.$route.query.id) {
        this.baseInfoForm.id = this.$route.query.id
        console.log(this.baseInfoForm)
        Basic.normal('shop/update', this.baseInfoForm).then(res => {
          if (res.code === 200) {
            vm.$message({ message: '编辑成功', type: 'success' })
            this.$router.go(-1)
          }
        })
      } else {
        Basic.normal('shop/save', this.baseInfoForm).then(res => {
          vm.$message({ message: '新增成功', type: 'success' })
          this.$router.go(-1)
        })
      }
    },
    handleCancel() {
      this.$router.go(-1)
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
  }
  /deep/ .el-form-item__content {
    // font-weight: bold;
    color: white;
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
    background: #005aa0;
  }
  .label-tail {
    width: 160px;
    height: 12px;
    margin-left: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
}
.fontWeig {
  width:100%;
}
.fontWeig /deep/ .el-form-item__label {
  font-weight:400;
  display:inline-block;
  text-align:right;
  width:120px;
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
