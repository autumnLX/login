<template lang="pug">
div.loginOperation
  div.loginpanel
    //- 身份选择
    ul.identityTab
      li(v-for="(item, index) in identityList" 
         :class="{active:identity === item}" 
         @click="changeIdentity(item)") {{ $t(`Login.loginBody.identity[${index}]`) }}
    //- 错误提示
    div.error-tip(:style='{ opacity: errorText ? 1 : 0 }')
      div
        span.error-tip-text {{ errorText }}
        span.error-tip-text.red(@click="toggleFindPwd") 忘记密码
    //- 用户名
    km-input(
      ref="input_unsername" 
      v-model="username" 
      placeholder='请输入用户名' 
      :autofocus="true" 
      @enter='login' 
      @change="clearErrorText")
      i.icon.icon_username(slot="icon")
    //- 密码
    km-input(
      ref="input_password" 
      v-model="password" 
      style="marginTop:20px" 
      type="password" 
      placeholder='请输入密码' 
      @enter='login' 
      @input="clearErrorText")
      i.icon.icon_password(slot="icon")
    div.operation
      span(@click="toggleFindPwd") {{ $t('Login.loginBody.forgetPass') }}？
    div.submit
      button(@click='login') {{ $t('Login.loginBody.login') }}
    div.other_operation.flex-center-center
      i.icon
      span(@click="downloadAppByCode") {{$t('Login.loginBody.downloadQR')}}
  //- 二维码
  div.qrCode(:class="{enter: showqrCode,leave: !showqrCode}" @mouseover='overShow' @mouseout='overHide')
    img.studentApp(src='https://download.chivoxapp.com/assets/learning/qr-stu-small.png')
    p.mobile {{ $t('Login.loginBody.studentMobile') }}
    img.teacherApp(src='https://download.chivoxapp.com/assets/learning/qr-tea-small.png')
    p.mobile {{ $t('Login.loginBody.teacherMobile') }}
</template>

<script>
import { unifyLogin } from '@/api'
import { $cookie, trim } from '@/util/Util'
import KmInput from '@/UI/km-input'

export default {
  name: 'Form',
  components: { KmInput },
  props: ['toggleFindPwd'],
  data () {
    return {
      identityList: ['student', 'teacher', 'parent', 'headmaster'],
      identity: 'student',
      errorText: '',
      showqrCode: false,
      username: '',
      password: '',
      clearSetTimeout: ''
    }
  },
  methods: {
    changeIdentity (type) { // 切换身份
      this.identity = type
    },
    login () {
      let { identity, username, password } = this
      username = trim(username)
      password = trim(password)

      if (!username && !password) {
        this.errorText = '账户名和密码都不能为空，是否'
      } else if (!username) {
        this.errorText = '账户名不能为空，是否'
      } else if (!password) {
        this.errorText = '密码不能为空，是否'
      } else {
        this.errorText = ''

        unifyLogin({
          identity,
          username,
          password
        }).then(res => {
          if (res.status) {
            const { location } = window
            const { relate_client, url } = res.data

            $cookie.set('identity', identity)
            $cookie.set('username', username)
            $cookie.set('password', password)

            if (relate_client) {
              const host = relate_client
              $cookie.set('origin', location.origin) // 用于测评系统返回二级域名（如果有）的作业系统
              $cookie.set('host', host) // 用于测评系统获取二级logo（如果有）
            } else {
              $cookie.set('origin', '')
              $cookie.set('host', '')
            }

            location.href = identity === 'student' ? '/stu' : '/web/' + url
          } else {
            this.errorText = '您输入的密码和账户名不匹配，是否'
          }
        })
      }
    },
    downloadAppByCode () {
      this.showqrCode = !this.showqrCode
      this.clearSetTimeout = window.setTimeout(() => {
        window.clearTimeout(this.clearSetTimeout)
        if (this.showqrCode) {
          this.showqrCode = !this.showqrCode
        }
      }, 5000)
    },
    overShow () {
      this.showqrCode = true
      window.clearTimeout(this.clearSetTimeout)
    },
    overHide () {
      this.showqrCode = false
      window.clearTimeout(this.clearSetTimeout)
    },
    clearErrorText () {
      this.errorText = ''
    },
  },
  created () {
    this.identity = $cookie.get('identity') || 'student'
    this.username = $cookie.get('username')
    this.password = $cookie.get('password')
  },
  mounted () {
    this.downloadAppByCode() // 显示二维码
  }
}
</script>

<style lang='less' scoped>
@import url('./Form.less');
</style>
