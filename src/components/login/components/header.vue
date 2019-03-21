<template lang="pug">
  div.login-header.bg-white(:class='{headerFix: isFix}')
    div
      img(:src='logo' ref='logo')
      div.linkArea.f16.text-ct
        //- a.fr(@click='changeLang') {{$t('header.lang')}}
        a.f16.fr(href='/mobileQR' target='_blank') {{ $t('header.app') }}
        a.f16.fr(href='/about' target='_blank') {{ $t('header.about') }}
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isFix: false,
      logo: ''
    }
  },
  methods: {
    changeLang() {
      this.$i18n.locale = this.$i18n.locale === 'zh' ? 'tw' : 'zh'
    }
  },
  created() {
    const customer = window.location.hostname.split('.')[0]
    if (window.ConfigNew.doubleBrandWhiteList.indexOf(customer) > -1) {
      this.logo = `https://download.chivoxapp.com/assets/kami/${customer}/web_logo.png`
    }
  },
  mounted() {
    this.$refs.logo.onerror = evt => {
      this.logo = 'https://download.chivoxapp.com/assets/kami/kami/web_logo.png'
    }
  }
}
</script>

<style lang='less'>
.login-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent !important;
  right: 0;
  margin: 0 auto;
  transition: all 0.75s ease;

  &.headerFix {
    background-color: #fff !important;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }

  & > div {
    width: 100%;
    height: 70px;
    padding: 0 180px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo img {
      width: auto;
      height: 70px;
      display: block;
    }

    .linkArea {
      display: flex;
      align-items: center;
      justify-content: center;

      a {
        width: 130px;
        height: 18px;
        line-height: 18px;
        border-right: 1px solid #ddd;
        display: block;

        &:last-child {
          border-right: none;
        }

        &:hover {
          color: #21bd73;
        }
      }
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
  }
}
</style>
