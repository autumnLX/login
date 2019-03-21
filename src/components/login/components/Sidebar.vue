<template lang="pug">
  div#sidebar
    //- 意见反馈
    div.feedback.sidebarSection(@click='handleFeedback')
      span.white.f16 {{$t('sidebar.feedback')}}
      i
    //- 二维码
    div.app.sidebarSection
      span.white.f16 {{$t('sidebar.app')}}
      i
      div.appDialog.bg-white
        p.f16.green {{$t('sidebar.appDialog.tips')}}
        img(src='https://download.chivoxapp.com/assets/learning/qr-stu-small.png' width='130' height='130')
    //- 帮助
    //- div.help.sidebarSection(v-if='$route.name !== "login"' @click='handleHelp')
      span.white.f16 {{$t('sidebar.help')}}
      i
    //- 置顶
    div.toTop.sidebarSection(@click='handleToTop' :style='{opacity: needToTop ? 1 : 0}')
      span.white.f16 {{$t('sidebar.top')}}
      i
    //- Feedback modal
    div.feedbackDialog.bg-white(v-if='showFBD')
      div.fbd-title.text-ct.white.bg-green
        | {{$t('sidebar.fbDialog.title')}}
        i.fbd-close(@click='handleCloseFB')
      div.fbd-form(v-if='fbStep === 1')
        div.row
          p {{$t('sidebar.fbDialog.contact')}}
          input(type='text' :placeholder='$t("sidebar.fbDialog.contactPH")' v-model='contact')
        div.row
          p {{$t('sidebar.fbDialog.suggest')}}
          textarea(v-model='suggest')
        button.btn(:class='contact && suggest ? "btn-green" : "btn-disabled"' @click='handleSubmitFB') {{$t('sidebar.fbDialog.submit')}}
      div.fbd-form(v-if='fbStep === 2')
        dl
          dt.f18.green.text-ct {{$t('sidebar.fbDialog.submitComplete')}}
          dd.text-ct {{$t('sidebar.fbDialog.thank')}}
        button.btn.btn-green(@click='handleContinueFB') {{$t('sidebar.fbDialog.continue')}}
      img.fbd-tips(src='@/assets/images/pic_hotline.png')
</template>

<script>
export default {
  name: 'sidebar',
  data() {
    return {
      customer: 'kamipro',
      needToTop: false,
      hoverTarget: '',
      showFBD: false,
      contact: '',
      suggest: '',
      fbStep: 1,
    }
  },
  methods: {
    handleFeedback() {
      this.fbStep = 1
      this.contact = ''
      this.suggest = ''
      this.showFBD = !this.showFBD
    },
    handleHelp() {
      // this.$router.push({name: 'stuHelp'})
    },
    handleToTop() {
      var cScroll = document.documentElement.scrollTop || document.body.scrollTop
      if (cScroll) {
        window.requestAnimationFrame(this.handleToTop)
        window.scrollTo(0, cScroll - (cScroll / 5))
      }
    },
    handleCloseFB() {
      this.showFBD = false
    },
    handleSubmitFB() {
      if (this.contact && this.suggest) {
        var browser = this.$util.browserCheck()
        this.$ajax.post('/feedbacks/addOneFeedback', {
          contact: this.contact,
          content: this.suggest,
          deviceOs: browser.name + ' ' + browser.version,
        }, (res) => {
          if (res.status === 1) {
            this.fbStep++
          } else {
            this.$store.commit('showErrDialog', {
              errText: res.info,
              btnText: this.$t('dialog.iknow')
            })
          }
        })
      }
    },
    handleContinueFB() {
      this.fbStep = 1
      this.contact = ''
      this.suggest = ''
    },
  },
  created() {
    this.customer = window.ConfigNew.customer
  },
  mounted() {
    window.addEventListener('scroll', (e) => {
      this.needToTop = window.scrollY > 200
    })
  }
}
</script>

<style lang='less' scoped>
#sidebar {
  position: fixed;
  right: 10px;
  bottom: 175px;
  z-index: 20;
  width: 60px;

  .sidebarSection {
    position: relative;
    display: flex;
    width: 60px;
    height: 60px;
    margin-top: 2px;
    align-items: center;
    justify-content: center;
    background-color: #24cc7c;

    &:hover {
      background-color: #21bd73;
      cursor: pointer;

      i {
        display: none;
      }

      span,
      div {
        display: block;
      }
    }

    span {
      display: none;
      width: 32px;
    }

    i {
      display: block;
      width: 60px;
      height: 60px;
      background-image: url("../../../assets/images/icon_float.png");
      background-repeat: no-repeat;
    }

    div {
      display: none;
    }

    &.feedback > i {
      background-position: 0 0;
    }
    &.app > i {
      background-position: -60px 0;
    }
    &.help > i {
      background-position: -120px 0;
    }
    &.toTop > i {
      background-position: -180px 0;
    }
  }
}

.feedbackDialog {
  position: fixed;
  right: 80px;
  bottom: 80px;
  z-index: 19;
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 450px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  .fbd-title {
    position: relative;
    width: 100%;
    height: 50px;
    font-size: 18px;
    line-height: 50px;

    .fbd-close {
      position: absolute;
      top: 10px;
      right: 3px;
      width: 30px;
      height: 30px;
      background: url("../../../assets/images/icon_commom3.png") no-repeat -120px 0;
      cursor: pointer;
    }
  }

  .fbd-tips {
    width: 254px;
    height: 50px;
    margin: 0 auto 30px;
  }

  .fbd-form {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .row {
      margin-bottom: 20px;

      p {
        margin-bottom: 10px;
      }

      input,
      textarea {
        width: 320px;
      }

      textarea {
        height: 120px;
      }
    }

    dl {
      padding-top: 50px;

      dt {
        margin-bottom: 30px;
      }

      dd {
        width: 252px;
        line-height: 24px;
        margin: 0 auto 40px;
      }
    }

    button {
      margin: 0 auto;
    }
  }
}

.appDialog {
  position: absolute;
  right: 80px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 216px;
  height: 216px;
  box-shadow: 0 2px 10px #e6e6e6;
  text-align: center;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 12px solid #fff;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    position: absolute;
    top: 50%;
    right: -12px;
    margin-top: -12px;
    display: block;
  }

  p {
    line-height: 30px;
    margin: 20px 0 10px;
  }
}
</style>