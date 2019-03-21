<template lang="pug">
  div#register.cover-w(v-if="showRegister")
    img#close(src="/static/login/images/btn_close.png" @click="close")
    vue-scroll
      div.contain
        img(src="/static/login/images/logo.png")
        p.title {{$t('Login.register.title')}}
        div.row
          label.f16.grey6
            span *
            | {{$t('Login.register.phoneNumber')}}
          input(type="text" v-model="phone" :class='{"error": errInput.phone}')
        div.row
          label.f16.grey6 
            span *
            | {{$t('Login.register.captcha')}}
          input.ic(type="text" :placeholder="$t('Login.register.captchaPh')" v-model="captcha" :class='{"error": errInput.verify}')
          img(:src="imgUrl" ref="icCode")
          a#change(@click="changeCode") {{$t('Login.register.changeOne')}}
        div.row.identity
          label.f16.grey6
            span *
            | {{$t('Login.register.phoneCode')}}
          div
            input(type="text" :placeholder="$t('Login.register.phoneCodePh')" v-model="phoneCode" :class='{"error": errInput.phoneCode}')
            a#phoneCode(href="#" @click="getVerifyCode" ref="code") {{$t('Login.register.getCode')}}
        div.row
          label.f16.grey6
            span *
            | {{$t('Login.register.password')}}
          input(type="text" :placeholder="$t('Login.register.passwordPh')" v-model="password" :class='{"error": errInput.pwd}')
        div.row.password
          label.f16.grey6
            span *
            | {{$t('Login.register.certifyPassword')}}
          input(type="text" :placeholder="$t('Login.register.newPasswordPh')" v-model="passwordOnceMore" :class='{"error": errInput.pwd2}')
        div.row.last
          div.f16.greyc.checkbox
            i.operation_icon(@click="toggle" :class="{active: selected}")
            span {{$t('Login.register.accept')}}
            a.f14.green(href="/web/statics/qsnxy-kami.html" target="_blank") {{$t('Login.register.agreement')}}
        p.errTips.red(v-if="errText.length > 0" v-text="errText")
        button.btn(name="register" @click="gotoPerfect") {{$t('Login.register.rMsg')}}
        div.goto.f14.grey6 {{$t('Login.register.haveOne')}}
          span#goLogin.f14.green(@click="gotoLogin") {{$t('Login.register.rightNow')}}
</template>
<script>
const registerInfo = {}
export default {
  name: 'register',
  props: ['showRegister'],
  data () {
    return {
      phone: '', // 手机号
      phoneCode: '', // 手机验证码
      captcha: '', // 图形验证码
      password: '',
      passwordOnceMore: '',
      selected: false,
      showPerfect: false,
      errText: '',
      imgUrl: '',
      wait60: false,
      errInput: {
        phone: false,
        verify: false,
        Pwd: false,
        Pwd2: false,
        phoneCode: false
      },
      timeId: ''
    }
  },
  methods: {
    gotoPerfect () {
      if (this.getVerify()) {
        this.collectInfo()
        this.$ajax.post('/FrontendStudents/register', registerInfo, (res) => {
          if (res.status === 1) {
            this.studentInfo = res.data
            this.$util.setCookie('phone', res.data.phone)
            this.$util.setCookie('headPic', res.data.headPic)
            this.$util.setCookie('id', res.data.id)
            sessionStorage.setItem('login', '1');
            this.$emit('showPerfectDialog', 2)
          } else {
            this.$store.commit('showErrDialog', {
              errText: res.info,
              btnText: this.$t('dialog.iknow')
            })
          }
        })
      }
    },
    toggle () {
      this.selected = !this.selected
    },
    gotoLogin () {
      this.$emit('disappear', 0)
    },
    close () {
      this.$emit('disappear', 0)
    },
    collectInfo () {
      registerInfo.phone = this.phone
      registerInfo.ic = this.captcha
      registerInfo.verifyNum = this.phoneCode
      registerInfo.password = this.password
      registerInfo.password2 = this.passwordOnceMore
    },
    getVerify () {
      this.errInput.phone = false
      this.errInput.verify = false
      this.errInput.Pwd = false
      this.errInput.Pwd2 = false
      this.errInput.phoneCode = false
      if (!/1[0-9]{10}/.test(this.phone)) {
        this.errText = this.$t('Login.register.error.phoneError')
        this.errInput.phone = true
        return false
      } else if (!this.captcha || this.captcha.length < 4) {
        this.errText = this.$t('Login.register.error.captchaError')
        this.errInput.verify = true
        return false
      } else if (!/^(\d{6}|\d{4})$/.test(this.phoneCode)) {
        this.errText = this.$t('Login.register.error.phoneCodeError')
        this.errInput.phoneCode = true
        return false
      } else if (!this.password) {
        this.errText = this.$t('Login.register.error.pwdEmpty')
        this.errInput.pwd = true
        return false
      } else if (!this.passwordOnceMore) {
        this.errInput.pwd2 = true
        return false
      } else if (this.password !== this.passwordOnceMore) {
        this.errText = this.$t('Login.register.error.pwdInconsistent')
        return false
      } else {
        return true
      }
    },
    getVerifyCode () {
      if (this.wait60) return false

      if (!/1[0-9]{10}/.test(this.phone)) {
        this.errText = this.$t('Login.register.error.phoneError')
        this.errInput.phone = true
        return false
      }

      if (!this.captcha || this.captcha.length < 4) {
        this.errText = this.$t('Login.register.error.captchaError')
        this.errInput.verify = true
        return false
      }
      this.wait60 = true
      let cd = 60
      let obj = this.$refs.code
      this.timeId = setInterval(() => {
        if (cd === 0) {
          clearInterval(this.timeId)
          console.log(obj)
          obj.innerHTML = '获取验证码'
          obj.style.color = '#21bd73'
          this.wait60 = false
        } else {
          cd--
          obj.innerHTML = cd + '秒后重新获取'
          obj.style.color = '#ccc'
        }
      }, 1000)

      this.$ajax.post('/FrontendStudents/sendMessage', {
        verifyCode: this.captcha,
        phone: this.phone
      }, (res) => {
        if (res.status !== 1) {
          clearInterval(this.timeId)
          this.$refs.code.innerHTML = '获取验证码'
          this.wait60 = false
          this.errText = res.info
        }
      })
    },
    changeCode () {
      this.imgUrl = '/api/FrontendStudents/getVerifyCode?yys=' + (+new Date())
    }
  },
  mounted () {
    this.changeCode()
  },
  beforeDestroy () {
    clearInterval(this.timeId)
  }
}
</script>
<style lang="less">
@image-url: '../../../../assets/image/common';
#register {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100%;
  #close {
    position: fixed;
    right: 70px;
    top: 50px;
    cursor: pointer;
    z-index: 999;
  }
  .vuescroll-content {
    display: flex;
    align-items: center;
    justify-content: center;

    .contain {
      text-align: center;
      z-index: 100;
      width: 100%;
      p {
        margin-top: 26px;
        margin-bottom: 30px;
        margin-left: 106px;
        font-size: 24px;
        color: #666;
        line-height: 30px;
      }
      & > img {
        margin-left: 112px;
      }
      & > div {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        label {
          line-height: 40px;
          margin-right: 20px;
          text-align: right;
          // display: inline-block;
          width: 110px;
          span {
            color: red;
            margin-right: 6px;
          }
        }
        input {
          width: 330px;
          height: 40px;
          padding-left: 10px;
          font-size: 16px;
          &.ic {
            width: 164px;
            height: 40px;
            padding-left: 10px;
            margin-right: 6px;
          }
          &:focus {
            border-color: #21bd73;
          }
        }
        a#change {
          color: #21bd73;
          font-size: 16px;
          line-height: 40px;
          text-decoration: underline;
        }

        img {
          width: 106px;
          height: 40px;
          vertical-align: bottom;
          margin-right: 10px;
          background-color: #fff;
        }
        &.last {
          margin-bottom: 0;
        }
        .checkbox {
          margin-bottom: 48px;
          margin-left: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          .operation_icon {
            width: 16px;
            height: 16px;
            display: inline-block;
            margin-right: 10px;
            background-image: url('@{image-url}/icon_common.png');
            background-position: 144px 0;
            &.active {
              background-image: url('@{image-url}/icon_common.png');
              background-position: 128px 0;
            }
          }
          span {
            color: #999;
            font-size: 14px;
          }
          a {
            line-height: 20px;
          }
        }
        &.password {
          margin-bottom: 24px;
        }
      }
      .identity {
        div {
          display: inline-block;
          margin-bottom: 0;
          position: relative;
          a {
            color: #21bd73;
            font-size: 16px;
            line-height: 40px;
            text-decoration: none;
            position: absolute;
            right: 10px;
            top: 0;
          }
        }
      }
      button {
        width: 330px;
        height: 50px;
        margin-bottom: 14px;
        margin-left: 121px;
        border-radius: 4px;
        color: #fff;
        font-size: 18px;
        line-height: 50px;
        background: linear-gradient(to right, #21bd73, #46bf97);
      }
      .errTips {
        color: #fa4b4b;
        font-size: 14px;
        margin-bottom: 10px;
        margin-top: -30px;
      }
      .goto {
        margin-left: 110px;
        #goLogin {
          cursor: pointer;
        }
      }
    }
  }
}
</style>