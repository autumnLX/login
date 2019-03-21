<template lang="pug">
  div.login-footer
    div
      p.fl.text-ct
        span.fl
          a.fl.f12.grey9(href='../../../static/page/youngsters.html' target='_blank') {{ $t('footer.youth') }}
          hr
        span.fl
          a.fl.f12.grey9(href='../../../static/page/declare.html' target='_blank') {{ $t('footer.declare') }}
          hr
        span.fl.f12.grey9
          | {{$t('footer.copyright')}}
          hr
        span.fl.f12.grey9 {{$t('footer.icp')}}
        span.fl.f12.grey9.gong-an 苏公网安备 32059002001971号
        //- img(src='/static/login/images/gswj.png' style='padding:0 10px;')
        a(href='http://www.jsdsgsxt.gov.cn/mbm/entweb/elec/certView.shtml?siteId=5bda9763ab144330bcc7f1482e5fcc6e' target="_blank")
          img(src='http://odr.jsdsgsxt.gov.cn:8081/mbm/app/main/electronic/images/ebsIcon.png' width='52' height='45' border='0' style='padding:0 10px;border:none;')
      div.browser
        a.f12.grey9(href='http://17ks.chivoxapp.com/guide/360cse_8.7.0.306.exe') 
          img.fl(src='@/assets/images/icon_browser-360.png' alt='360')
          | {{ $t('footer.browser360') }}
        a.f12.grey9(href='http://17ks.chivoxapp.com/guide/QQBrowser_Setup_SEM1.exe')
          img.fl(src='@/assets/images/icon_browser-qq.png' alt='QQ')
          | {{ $t('footer.browserqq') }}
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
    }
  }
}
</script>

<style lang='less'>
.login-footer {
  width: 100%;
  height: 80px;
  background-color: #444;

  & > div {
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      // width: auto;
      // height: 30px;
      display: flex;
      align-items: center;

      span {
        line-height: 30px;
        padding: 0 11px 0 10px;
        display: flex;
        position: relative;

        &.gong-an {
          padding-left: 25px;
          margin-left: 5px;
          background: url("/static/login/images/abc.png") no-repeat left center;
        }

        a {
          height: 30px;
          line-height: 30px;
        }

        hr {
          width: 0;
          height: 10px;
          border-right: 1px solid #666;
          border-top: 0;
          position: absolute;
          top: 10px;
          right: 0;
        }
      }
    }

    div.browser {
      a {
        width: auto;
        height: 30px;
        line-height: 28px;
        margin-left: 10px;
        border: 1px solid #666;
        padding-right: 10px;
        display: inline-block;
      }
    }
  }
}
</style>
