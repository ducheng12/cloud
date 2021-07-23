<!--销售单详情-->
<template>
  <div class="app-container">
    <div class="app-nav">
      <el-page-header class="back" @back="$router.back()">返回</el-page-header>
    </div>
    <div style="overflow:hidden">
      <p class="zc">基本信息 </p>
      <div style="float:left;">
        <p>
          <span class="widt70">云店名称：</span>
          <span class="colo-rgb">{{ name }}</span>
        </p>
        <p>
          <span class="widt70">云店地址：</span>
          <span class="colo-rgb">{{ address }}</span>
        </p>
        <p>
          <span class="widt70">主营类目：</span>
          <span class="colo-rgb">{{ mainTypeZ }}</span>
        </p>
        <p>
          <span class="widt70">联系人：</span>
          <span class="colo-rgb">{{ relation }}</span>
        </p>
        <p>
          <span class="widt70">联系电话：</span>
          <span class="colo-rgb">{{ relationPhone }}</span>
        </p>
        <p>
          <span class="widt70">法人：</span>
          <span class="colo-rgb">{{ legalPerson }}</span>
        </p>
      </div>
    </div>
    <div style="overflow:hidden">
      <p class="zc">云店信息 </p>
      <div style="float:left;">
        <p>
          <span class="widt70 pos116">营业执照：</span>
          <img
            v-if="busiLicImg !== ''"
            :src="busiLicImg"
            class="widt130"
            @click="picImg(busiLicImg)"
          />
          <br>
          <span v-if="shopImgs.length !== 0" class="widt70"></span>
          <span v-if="shopImgs.length !== 0">(点击查看大图)</span>
        </p>
        <p>
          <span class="widt70 pos116">云店照片：</span>
          <span v-for="item in shopImgs" :key="item">
            <img v-if="shopImgs.length !== 0" :src="item" class="widt130" @click="picImg(item)" />
          </span>
          <br>
          <span v-if="shopImgs.length !== 0" class="widt70"></span>
          <span v-if="shopImgs.length !== 0">(点击查看大图)</span>
        </p>
        <p>
          <span class="widt70 pos116">法人身份证：</span>
          <span v-for="item in legalIdCardImgs" :key="item">
            <img v-if="shopImgs.length !== 0" :src="item" class="widt130" @click="picImg(item)" />
          </span>
          <br>
          <span v-if="shopImgs.length !== 0" class="widt70"></span>
          <span v-if="shopImgs.length !== 0">(点击查看大图)</span>
        </p>
      </div>
    </div>
    <div style="overflow:hidden">
      <p class="zc">云镜信息</p>
      <div style="float:left;">
        <p v-for="itme in mirrorNos" :key="itme">
          <span class="widt70">设备ID：</span>
          <span class="colo-rgb">{{ itme }}</span>
        </p>
      </div>
    </div>
    <public-dialog
      :visible="returnedPurchaseView"
      :custom-class="'dialog-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <img :src="diaImg" style="width:500px;height:500px;" />
    </public-dialog>
  </div>
</template>

<script>
import { Basic } from '@/api/base'
import PublicDialog from '@/components/Dialog/PublicDialog'
export default {
  components: { PublicDialog },
  data() {
    return {
      name: '',
      mainType: '',
      mainTypeZ: '',
      address: '',
      returnedPurchaseView: false,
      relation: '',
      relationPhone: '',
      legalPerson: '',
      busiLicImg: '',
      diaImg: '',
      shopImgs: [],
      legalIdCardImgs: [],
      mirrorNos: []
    }
  },
  computed: {},
  mounted() {
    this.infoDetail()
  },
  methods: {
    goBack() { // 返回上一级
      this.$router.go(-1)
    },
    // 获取详情页面信息
    infoDetail() {
      const vm = this
      const params = {
        id: vm.$route.query.id
      }
      const imgUrl = process.env.VUE_APP_FILE_URL_OBS + '/'
      // const imgUrl = 'https://yswl-cloud-service.obs.cn-north-4.myhuaweicloud.com/'
      Basic.normal('shop/info', params).then(res => {
        if (res.code === 200) {
          vm.name = res.data.name
          vm.orderId = res.data.orderId
          vm.address = res.data.fullAddress
          vm.mainType = res.data.mainType
          if (vm.mainType === 1) {
            vm.mainTypeZ = '女装'
          }
          // busiLicImg
          vm.relation = res.data.relation
          vm.relationPhone = res.data.relationPhone
          vm.legalPerson = res.data.legalPerson
          vm.busiLicImg = imgUrl + res.data.busiLicImg
          if (res.data.busiLicImg) {
            vm.busiLicImg = imgUrl + res.data.busiLicImg
          } else {
            vm.busiLicImg = ''
          }
          res.data.shopImgs.forEach(t => {
            vm.shopImgs.push(imgUrl + t)
          })
          res.data.legalIdCardImgs.forEach(t => {
            vm.legalIdCardImgs.push(imgUrl + t)
          })
          vm.mirrorNos = res.data.mirrorNos
        }
      })
    },
    // 分页
    picImg(p) {
      this.returnedPurchaseView = true
      this.diaImg = p
    },
    handleCancel() {
      this.returnedPurchaseView = false
    },
    afterClosed() {
      this.returnedPurchaseView = false
    }
  }
}
</script>
<style lang='scss' scoped>
*{
  font-family: PingFangSC, PingFangSC-Regular;
}
.colo-rgb{
  color:rgba(0,0,0,0.45);
}
::v-deep .app-nav {
  height: 66px;
  line-height: 66px;
  position: relative;
}
.icons {
  font-size: 20px;
}
.widt70{
  width:100px;
  display:inline-block;
  text-align:right;
}
.pos116{
  height:130px;
  vertical-align: bottom;
}
.hyName {
  display: inline-block;
  margin-left: 15px;
  font-size: 20px;
}
.gmcs {
  float: right;
}
.zc {
  font-size: 20px;
  color:#000000;
  float:left;
  margin-right:20px;
  margin-top:14px;
}
.xfze {
  position: absolute;
  right: 24px;
  top: 115px;
}
.shrxx {
  padding: 25px 0;
  font-size: 16px;
  position: relative;
  font-family: PingFangSC, PingFangSC-Regular;
}
hr{
  color: rgba(0, 0, 0, 0.85);
  position: absolute;
  left: 0px;
  top: 38px;
  width: 80px;
}
.shri{
  display: inline-block;
  height: 1px;
  background: red;
}
.hyfz{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 250px;
}
.widt130{
  width:130px;
  height:130px;
  margin-right:10px;
}
.public-dialog /deep/ .el-dialog{
  width: 590px !important;
  text-align:center;
  padding-top:50px;
}
.back /deep/ .el-page-header__left::after {
  width:0!important;
}
.back /deep/  .el-page-header__title{
  font-size: 20px;
}
/deep/ .app-nav{
  height:40px;
}
</style>
