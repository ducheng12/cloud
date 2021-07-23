<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-introduce">
        <div class="login-content">
          <div class="login-hello">Hi，您好！</div>
          <div class="login-welcome">欢迎来到懂衣大数据运营中心</div>
          <div class="login-analysis"><span style="margin-right:5px;">业务支持</span> · <span style="margin-left:5px;margin-right:5px;">运营决策</span> · <span style="margin-left:5px;">数据分析</span></div>
        </div>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="off"
        label-position="left"
      >
        <div class="title-container">
          <span></span>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <i class="iconfont iconiconuser"></i>
            <!-- <svg-icon icon-class="user" /> -->
          </span>
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            placeholder="请输入登录账号"
            name="username"
            auto-complete="off"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <i class="iconfont iconiconpassword"></i>
            <!-- <svg-icon icon-class="password" /> -->
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="请输入登录密码"
            name="password"
            auto-complete="off"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          class="login-sub"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
    </div>
    <div class="login-record">Copyright2021-2026深圳云裳衣联网科技有限公司 鲁ICP备19033654号-1</div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import qs from 'qs'
import { setToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      const vm = this
      vm.$refs.loginForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.loginForm))
          params.password = md5(params.password)
          params = qs.stringify(params)
          vm.loading = true
          // const API = process.env.NODE_ENV === 'development' ? '/lg' : process.env.VUE_APP_BASE_API
          vm.$axios
            .post(`/lg/login`, params)
            .then(res => {
              const { data } = res
              if (data.code !== 200) {
                vm.$message.error(data.msg || '服务器异常')
                vm.loading = false
                return false
              }
              const token = data.data
              if (token) {
                setToken('Bearer ' + token)
                vm.loading = false
                vm.$router.push({ path: '/' })
              }
            })
            .catch(() => {
              vm.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #f8f8f8 ;
$light_gray: #fff;
$cursor: #333333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position:relative;
  .el-input {
    display: inline-block;
    height: 50px;
    width: 280px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 10px;
      color: #333333;
      height: 50px;
      caret-color: #333333;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
        font-size: 13px!important;
      }
    }
    ::-webkit-input-placeholder {
      color: rgba(154,149,149,1);
    }
  }
  .el-form-item {
    height: 50px;
    background: #F8F8F8;
    border-radius: 25px;
    color: #454545;
    margin-bottom: 28px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  min-height: 666px;
  background: url("./bg.jpg") center no-repeat;
  background-size: cover;
  .login-main {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1226px;
    transform: translate(-50%, -50%);
    box-shadow: 0 29px 29px -29px rgba(0, 0, 0, .6);
  }
  .login-introduce {
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    width: 710px;
    height: 510px;
    position: relative;
    float: left;
    border-radius: 6px 0 0 6px;
    background: linear-gradient(176deg,rgba(243,244,252,.45) 0%, rgba(22,23,85,.45) 100%);
    overflow: hidden;
    .login-content{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 9;
      padding: 155px 0 176px 70px;
      color: #ffffff;
    }
  }
  .login-form {
    width: 516px;
    max-width: 100%;
    height: 510px;
    overflow: hidden;
    float: left;
    padding:76px 83px 97px;
    background-color: #fff;
    border-radius: 0 6px 6px 0;
  }
  .login-record {
    position: absolute;
    bottom:30px;
    text-align: center;
    color:#fff;
    font-size: 14px;
    width:100%;
    left:0;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0px 0px 0px 20px;
    color: var(--theme-color);
    vertical-align: middle;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: inline-block;
    .iconfont {
      font-size: 20px;
    }
  }

  .title-container {
    position: relative;
    text-align: center;
    margin-bottom: 61px;
    span{
      display: inline-block;
      width:94px;
      height:53px;
      background: url('pic_logo.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .show-pwd {
    position: absolute;
    right: 20px;
    top: 6px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    text-align: center;
    width:26px;
    background-color: #F8F8F8;
  }
}
.login-sub {
  width: 100%;
  margin-bottom: 30px;
  margin-top: 17px;
  height: 50px;
  border-radius: 25px;
  font-size:21px;
  font-weight:500;
}
.login-hello{
  font-size: 38px;
  font-weight:200;
}
.login-welcome{
  font-size:40px;
  margin:22px 0 24px;
  font-weight:200;
}
.login-analysis{
  font-size:22px;
  font-weight:200;
}
</style>
