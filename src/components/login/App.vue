<template lang='pug'>
  div#app
    Header(ref='header')
    div#Login
      div.first_screen
        //- 轮播图
        div.banner-container
          div.banner-wrapper(
            :class='{animated: slideAnimated}' 
            :style='{transform: "translateX(" + offset + "px)"}' 
            @transitionend='handleSlideEnd')
            div.banner(v-for='idx in "010"' :class="('b' + idx)")
          div.banner-indicator
            div(:class='{ active: indicate % 2 === 0}')
            div(:class='{ active: indicate % 2 === 1}')
        //- 登录框
        Form(:toggleFindPwd='toggleFindPwd')
      div.lazy.second_screen(name='s2')
        transition(enter-active-class="animated fadeIn")
          img(src='https://17ks.chivoxapp.com/screen2.png' v-if='imgs.s2')
      div.lazy.third_screen(name='s3')
        transition(enter-active-class="animated fadeIn")
          div(v-if='imgs.s3')
            ul
              li(v-for="(item, index) in gallery" :style='{backgroundImage: "url(https://17ks.chivoxapp.com/" + item.url + ".png)"}' @click="scrollPosition(index)")
                div
                  span.text1 {{ item.text1 }}&nbsp;&nbsp;&nbsp;>
                  span.text2 {{ item.text2 }}
      div.lazy.intro(v-for='index in "4567"' :name='"s" + index' class='d_scroll')
        transition(enter-active-class="animated fadeIn")
          img(:src='"https://17ks.chivoxapp.com/screen" + index + ".png"' v-if='imgs["s" + index]')
      div.lazy.eight_screen(name='s8')
        transition(enter-active-class="animated fadeIn")
          img(src='https://17ks.chivoxapp.com/screen8.png' v-if='imgs.s8')
    Footer(ref='footer')
    Sidebar
    FindPwd(ref="findPwd" :toggleFindPwd='toggleFindPwd' v-if='showFP')
</template>

<script>
import Header from './components/header'
import Footer from './components/footer'
import Sidebar from './components/Sidebar'
import Form from './components/Form'

const FindPwd = () => import('./components/findPwd')

export default {
  name: 'Login',
  components: { Header, Footer, Sidebar, Form, FindPwd },
  data () {
    return {
      offset: 0,
      slideAnimated: true,
      imgs: { s2: false, s3: false, s4: false, s5: false, s6: false, s7: false, s8: false },
      gallery: [
        {
          text1: '老师的贴心助手',
          text2: '让老师轻松教学',
          url: 'screen_teacher'
        }, {
          text1: '学生的良师益友',
          text2: '让学生更懂自己',
          url: 'screen_student'
        }, {
          text1: '家长的放心陪读',
          text2: '让家长轻松育儿',
          url: 'screen_parent'
        }, {
          text1: '教研的得力助手',
          text2: '让教研更懂教育',
          url: 'screen_section'
        },
      ],
      showFP: false, // 显示忘记密码对话框
      indicate: 0,
    }
  },
  methods: {
    handleSlideEnd (evt) {
      if (evt.propertyName === 'transform') {
        if (this.indicate === 2) {
          this.slideAnimated = false
          this.indicate = 0
          this.offset = 0
        }
        this.slide()
      }
    },
    slide () {
      setTimeout(() => {
        this.slideAnimated = true
        this.indicate += 1
        this.offset = 0 - document.body.clientWidth * this.indicate
      }, 2000)
    },
    scrollPosition (index) {
      let total = document.querySelectorAll('.d_scroll')[index].offsetTop
      let distance = document.documentElement.scrollTop || document.body.scrollTop
      const step = total / 50
      total > distance && smoothDown()

      function smoothDown () {
        if (distance < total) {
          distance += step
          window.scrollTo(0, distance)
          setTimeout(smoothDown, 10)
        } else {
          window.scrollTo(0, total - 90)
        }
      }
    },
    toggleFindPwd () {
      this.showFP = !this.showFP
    }
  },
  mounted () {
    const windowHeight = window.innerHeight
    const lazyObjs = {}
    const lazyElms = document.getElementsByClassName('lazy')
    Array.prototype.forEach.call(lazyElms, elm => {
      lazyObjs[elm.attributes.name.value] = Number((elm.getBoundingClientRect()).top)
    })
    window.onscroll = (evt) => {
      const height = windowHeight + window.scrollY
      for (let key in lazyObjs) {
        if (lazyObjs[key] < height - 200) {
          this.imgs[key] = true
          delete lazyObjs[key]
        }
      }
    }

    this.slide()
  }
}
</script>

<style lang='less' scoped>
@import url('./app.less');
</style>
