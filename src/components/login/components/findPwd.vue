<template lang="pug">
  div.cover-w
    div.findPwd
      label.fp-close(@click='toggleDialog')
        img(src='/static/login/images/btn_close.png')
      dl
        dt
          img(src='/static/login/images/logo.png' alt='kami')
        dd.f24.text-ct {{ $t('Login.findPwd.title') }}
      //- 导航
      div.fp-stepBox
        span.f16(:class='{green: step >= 1}')
          i
          | {{ $t('Login.findPwd.step[0]') }}
        hr
        span.f16(:class='{green: step >= 2}')
          i
          | {{ $t('Login.findPwd.step[1]') }}
        hr
        span.f16(:class='{green: step >= 3}')
          i
          | {{ $t('Login.findPwd.step[2]') }}
      //- 分步骤
      div.fp-formBox
        div.inputBox(v-show='step === 1')
          div.phone.col
            span.f16 {{ $t('Login.findPwd.phone') }} :
            input(
              type='text'
              :class='{error: errInput.phone}'
              :placeholder='$t("Login.findPwd.phonePH")'
              v-model='phone'
              maxlength='11'
              autocomplete="off"
            )
          div.verify.col
            span.f16 {{ $t('Login.findPwd.verify') }} :
            input(
              type='text'
              :class='{error: errInput.verify}'
              :placeholder='$t("Login.findPwd.verifyPH")'
              v-model='verify'
              autocomplete="off"
            )
            label.green(@click='getVerify' v-if='verifyState === "ready"') {{ $t('Login.findPwd.verifyBtn') }}
            label.greyc(v-else) {{verifyTimeout}}s
        div.inputBox(v-show='step === 2')
          div.phone.col
            span {{ $t('Login.findPwd.phone') }} :
            p {{phone}}
          div.newPwd.col
            span {{ $t('Login.findPwd.newPwd') }} :
            input(
              type='password'
              :class='{error: errInput.newPwd}'
              :placeholder='$t("Login.findPwd.newPwdPH")'
              v-model='newPwd'
              autocomplete="off"
            )
          div.newPwd2.col
            span {{ $t('Login.findPwd.newPwd2') }} :
            input(
              type='password'
              :class='{error: errInput.newPwd2}'
              :placeholder='$t("Login.findPwd.newPwdPH2")'
              v-model='newPwd2'
              autocomplete="off"
            )
        div.inputBox(v-show='step === 3')
          img(src='/static/login/images/ic_success.png' alt='icon')
          p.f24.grey3 {{ $t('Login.findPwd.success') }}！
        p.errTips.red(
          :style='{ visibility: errText.length > 0 ? "visible" : "hidden" }' v-if='step < 3') {{errText}}
        button.f18.btn.btn-gradient(@click='goToNext') {{step === 3 ? $t('Login.findPwd.relogin') : $t('Login.findPwd.next') }}
      p.fp-tips.text-ct {{ $t('Login.findPwd.tips') }}
</template>

<script>
import { getVerificationCode, verifyVerificationCode, resetPassword } from '@/api'
const verifyTime = 60
export default {
  name: 'login',
  props: ['toggleFindPwd'],
  data () {
    return {
      step: 1,
      verifyState: 'ready',
      verifyTimeout: verifyTime,
      errText: '',
      errInput: {
        phone: false,
        verify: false,
        newPwd: false,
        newPwd2: false
      },
      phone: '',
      verify: '',
      newPwd: '',
      newPwd2: ''
    }
  },
  methods: {
    clearCountdown () {
      clearInterval(this.countdown)
      this.verifyState = 'ready'
      this.verifyTimeout = verifyTime
    },
    toggleDialog () {
      this.toggleFindPwd()
    },
    getVerify () {
      if (!/1[0-9]{10}/.test(this.phone)) {
        this.errText = this.$t('Login.findPwd.error.phoneError')
        this.errInput.phone = true
      } else {
        this.errText = ''
        this.errInput.phone = false
        this.verifyState = 'getting'
        this.countdown = setInterval(() => {
          this.verifyTimeout--
          if (this.verifyTimeout === 0) {
            this.clearCountdown()
          }
        }, 1000)

        getVerificationCode({
          useFor: 'password',
          phone: this.phone
        }).then(res => {
          if (res.status !== 1) {
            this.errText = res.info
            this.clearCountdown()
          }
        })
      }
    },
    goToResetPwd () {
      if (!/1[0-9]{10}/.test(this.phone)) {
        this.errText = this.$t('Login.findPwd.error.phoneError')
        this.errInput.phone = true
      } else if (this.verify <= 0) {
        this.errText = this.$t('Login.findPwd.error.verifyEmpty')
        this.errInput.phone = false
        this.errInput.verify = true
      } else {
        this.errText = ''
        this.errInput.phone = false
        this.errInput.verify = false

        verifyVerificationCode({
          phone: this.phone,
          verifyNum: this.verify
        }).then(res => {
          if (res.status === 1) {
            this.step += 1
          } else {
            this.errText = res.info
          }
        })
      }
    },
    goToRelogin () {
      const { phone, newPwd, newPwd2, verify } = this

      this.errText = ''
      this.errInput.newPwd = false
      this.errInput.newPwd2 = false

      if (newPwd && newPwd2 && newPwd === newPwd2) {
        resetPassword({
          useFor: 'password',
          phone,
          verifyNum: verify,
          password: newPwd
        }).then(res => {
          if (res.status === 1) {
            this.step += 1
          } else {
            this.errText = res.info
          }
        })
      } else {
        if (newPwd !== newPwd2) {
          this.errText = this.$t('Login.findPwd.error.pwdInconsistent')
          this.errInput.newPwd = true
          this.errInput.newPwd2 = true
        } else if (!newPwd) {
          this.errText = this.$t('Login.findPwd.error.pwdEmpty')
          this.errInput.newPwd = true
        } else if (!newPwd2) {
          this.errText = this.$t('Login.findPwd.error.pwdEmpty')
          this.errInput.newPwd2 = true
        }
      }
    },
    goToNext () {
      const step = this.step
      if (step === 1) {
        this.goToResetPwd()
      } else if (step === 2) {
        this.goToRelogin()
      } else if (step === 3) {
        this.toggleFindPwd()
      } else {
        console.log('unknown step in findPwd.vue')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.findPwd {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .fp-close {
    position: absolute;
    top: 50px;
    right: 70px;
    cursor: pointer;
  }

  dl {
    padding-top: 130px;
    margin-bottom: 45px;

    dt {
      margin-bottom: 26px;
    }

    dd {
      line-height: 30px;
    }
  }

  .fp-stepBox {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        width: 10px;
        height: 10px;
        border: 1px solid #ccc;
        border-radius: 50%;
        margin-right: 10px;
      }

      &.green > i {
        background-color: #21bd73;
        border-color: #21bd73;
      }
    }

    hr {
      width: 80px;
      margin: 0 10px;
    }
  }

  .fp-formBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;

    .inputBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .col {
        width: 330px;
        position: relative;
        margin-top: 35px;

        span {
          width: auto;
          line-height: 40px;
          text-align: right;
          display: inline-block;
          position: absolute;
          top: 0;
          right: 350px;
          white-space: nowrap;
        }

        input {
          width: 330px;
          height: 40px;
          border-radius: 2px;
        }

        label {
          width: auto;
          height: 40px;
          line-height: 40px;
          display: inline-block;
          position: absolute;
          right: 10px;
          top: 0;
          cursor: pointer;
        }

        p {
          line-height: 40px;
          padding-left: 11px;
        }
      }

      & > img {
        margin: 70px auto 20px;
      }

      & > p {
        margin-bottom: 100px;
        line-height: 40px;
      }
    }

    .errTips {
      height: 60px;
      line-height: 60px;
      margin-bottom: 0;
      align-self: flex-start;
    }

    button {
      width: 330px;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
