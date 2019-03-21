<template lang="pug">
  div#perfect.cover-w
    img#close(src="/static/login/images/btn_close.png" @click="close")
    div.contain
      img(src="/static/login/images/logo.png")
      p.title {{$t('Login.perfect.title')}}
      div.row.name
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.name')}}
          input(type="text" ref="name" v-model="name" :placeholder="$t('Login.perfect.namePh')")
          span.errTips.red(v-if="errText.stuNameErrMsg.length > 0" v-text="errText.stuNameErrMsg")
      div.row.sex
        div.left
        div.right
          label.f16.grey6 {{$t('Login.perfect.sex')}}
          div.radio
            Radio(:flag="defaultSex" :property="1" @toParent="fromChild")
            label.f16.grey6(name="1" :class='{"selected": defaultSex}') {{$t('Login.perfect.sexDefault')}}
            Radio(:flag="!defaultSex" :property="0" @toParent="fromChild")
            label.f16.grey6(name="0" :class='{"selected": !defaultSex}') {{$t('Login.perfect.sexOther')}}
      div.row.idNumber
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.idNumber')}}
          input(type="text" :placeholder="$t('Login.perfect.idNumberPh')" v-model="idNumber")
          span.errTips.red(v-if="errText.idNumberErrMsg.length > 0" v-text="errText.idNumberErrMsg")
      div.row.areafilter
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.area')}}
          Select(ref="sf" :ops="selectSF")
          Select(ref="sq" :ops="selectSQ")
          Select(ref="qy" :ops="selectQY")
          span.errTips.red(v-if="errText.areaErrMsg.length > 0" v-text="errText.areaErrMsg")
      div.row.schoolfilter
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.school')}}
          Select(ref="selectSchool" :ops="selectXx")
          span.f16.grey6 {{$t('Login.perfect.other')}}
          input(type="text" :placeholder="$t('Login.perfect.schoolPh')" v-model="schoolName" @change='clearMs')
          span.errTips.red(v-if="errText.schoolErrMsg.length > 0" v-text="errText.schoolErrMsg")
      p.msg1.f14.grey9 {{$t('Login.perfect.schoolMsg')}}
      div.row.categroyFilter
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.categroy')}}
          Select(ref="categroy" :ops="selectNj")
          span.errTips.red(v-if="errText.categoryErrMsg.length > 0" v-text="errText.categoryErrMsg")
      div.row.classFilter
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.class')}}
          Select(ref="class" :ops="selectBj")
          span.errTips.red(v-if="errText.classErrMsg.length > 0" v-text="errText.classErrMsg")
      div.row.teach
        div.left
        div.right
          label.f16.grey6
            span *
            | {{$t('Login.perfect.teacher')}}
          input(type="text" :placeholder="$t('Login.perfect.teacherPh')" v-model="teachName")
          span.errTips.red(v-if="errText.teaNameErrMsg" v-text='errText.teaNameErrMsg')
      div.row.phone
        div.left
        div.right
          label.f16.grey6
            | {{$t('Login.perfect.teacherPhone')}}
          input(type="text" :placeholder="$t('Login.perfect.teacherPhonePh')")
          span.errTips.red(v-if="errText.teaNumberErrMsg" v-text="errText.teaNumberErrMsg")
      p.attention {{$t('Login.perfect.attention')}}
      p.errMsg.red(v-if='errMsg.length > 0' v-text='errMsg')
      button.btn(name="perfect" @click="Save") {{$t('Login.perfect.save')}}
</template>
<script>
import Select from '@/UI/Select'
import Radio from '@/UI/Radio'
const perfectInfo = {}
export default {
  name: 'perfect',
  components: { Select, Radio },
  data () {
    return {
      cursf: '',
      cursq: '',
      curqy: '',
      curSchool: '',
      curNj: '',
      curBj: '',
      teachName: '',
      first: false,
      schoolName: '',
      name: '',
      gender: 1,
      defaultSex: true,
      // isClose: false,
      errText: {
        stuNameErrMsg: '',
        idNumberErrMsg: '',
        schoolErrMsg: '',
        areaErrMsg: '',
        categoryErrMsg: '',
        classErrMsg: '',
        teaNameErrMsg: '',
        teaNumberErrMsg: ''
      },
      idNumber: '',
      errMsg: '',
      areaArr: [],
      categroys: [],
      perfectInfo: {},
      selectSF: {
        dataList: [],
        default: 0,
        callback: (val, txt, index) => {
          this.cursf = val
        }
      },
      selectSQ: {
        dataList: [],
        default: 0,
        callback: (val, txt, index) => {
          this.cursq = val
          this.getQY(val)
        }
      },
      selectQY: {
        dataList: [],
        default: 0,
        callback: (val, txt, index) => {
          this.curqy = val
          this.getSchools(val)
        }
      },
      selectXx: {
        dataList: [],
        default: 0,
        callback: (val, txt, index) => {
          // 每次进来先初始化first变量为false
          this.first = false
          this.curSchool = val
          this.getCategroy(val)
          // 如果选中的是第一个,则不清空后面input内的值
          if (txt === '请选择学校') {
            this.first = true
          }
          // 如果选中的不是第一个,则清空后面input内的值
          if (!this.first) {
            this.schoolName = ''
          }
          // this.schoolName = ''
        }
      },
      selectNj: {
        dataList: [],
        default: 0,
        callback: (val, txt, index) => {
          this.curNj = val
          this.getClass(val)
        }
      },
      selectBj: {
        dataList: [],
        default: 0,
        callback: (val, txt, index) => {
          this.curBj = val
        }
      }
    }
  },
  methods: {
    getSQ (val) {
      let sqList = [
        {
          id: 0,
          name: '请选择市'
        }
      ]
      let sqMsg = []
      for (let i = 0; i < this.areaArr.length; i++) {
        if (val === this.areaArr[i].id) {
          sqMsg = this.areaArr[i].city
          for (let j = 0; j < sqMsg.length; j++) {
            sqList.push({
              id: sqMsg[j].id,
              name: sqMsg[j].name
            })
          }
        }
      }
      this.$refs.sq.setList(sqList)
      this.$refs.sq.setVal(sqMsg[0].id)
    },
    getQY (val) {
      let qyList = [
        {
          id: 0,
          name: '请选择区'
        }
      ]
      let distractArr = []
      let areaArrLen = this.areaArr.length

      for (let i = 0; i < areaArrLen; i++) {
        if (this.cursf === this.areaArr[i].id) {
          let sqList = this.areaArr[i].city
          for (let j = 0; j < sqList.length; j++) {
            if (this.cursq === sqList[j].id) {
              let curQyList = (distractArr = sqList[j].country)
              for (let k = 0; k < curQyList.length; k++) {
                let qyMsg = curQyList[k]
                qyList.push({
                  id: qyMsg.id,
                  name: qyMsg.name
                })
              }
            }
          }
        }
      }
      this.$refs.qy.setList(qyList)
      this.$refs.qy.setVal(distractArr[0].id)
    },
    getSchools (val) {
      this.$jsonp(
        '/webCompetition/getSchoolInfoByCity?countryId=' + val,
        {},
        (err, res) => {
          if (res.status === 1) {
            let schoolList = res.data
            let xxList = [
              {
                id: 0,
                name: '请选择学校'
              }
            ]
            for (let i = 0; i < schoolList.length; i++) {
              let schoolMsg = schoolList[i]
              xxList.push({
                id: schoolMsg.id,
                name: schoolMsg.school_name
              })
            }
            this.$refs.selectSchool.setList(xxList)
            this.$refs.selectSchool.setVal(schoolList[0].id)
          } else {
            console.log(err)
          }
        }
      )
    },
    getCategroy (val) {
      this.$jsonp(
        '/Student/getClassInfoBySchool??callback=jsonp&schoolId=' + val,
        {},
        (err, res) => {
          if (res.status === 1) {
            this.categroys = res.data
            let categroyList = [
              {
                id: 0,
                name: '请选择所在年级'
              }
            ]
            for (let i = 0; i < res.data.length; i++) {
              let categroyMsg = res.data[i]
              categroyList.push({
                id: categroyMsg.category_id,
                name: categroyMsg.category_name
              })
            }
            this.$refs.categroy.setList(categroyList)
            this.$refs.categroy.setVal(this.categroys[0].category_id)
          } else {
            console.log(err)
          }
        }
      )
    },
    getClass (val) {
      let classList = [
        {
          id: 0,
          name: '请选择所在班级'
        }
      ]
      let classArr = []
      for (let i = 0; i < this.categroys.length; i++) {
        if (val === this.categroys[i].category_id) {
          classArr = this.categroys[i].class
          for (let j = 0; j < classArr.length; j++) {
            let classMsg = classArr[j]
            classList.push({
              id: classMsg.class_id,
              name: classMsg.class_name
            })
          }
        }
      }
      this.$refs.class.setList(classList)
      this.$refs.class.setVal(this.categroys[0].class[0].class_id)
    },
    Save () {
      this.collectInfo()
      if (this.getVerify()) {
        this.$ajax.post('/postAssessment/post', perfectInfo, res => {
          if (res.status === 1) {
            sessionStorage.setItem('login', '1')
            this.$util.setCookie('classId', res.data.school_class_id)
            this.$util.setCookie(
              'fullName',
              encodeURIComponent(perfectInfo.stuName)
            )
            this.$util.setCookie(
              'categoryName',
              encodeURIComponent(perfectInfo.cateName)
            )
            this.$util.setCookie(
              'className',
              encodeURIComponent(perfectInfo.className)
            )
            this.$toast({
              text: '信息保存成功！',
              showWrap: false,
              duration: 2000,
              styleObj: {
                width: '240px',
                height: '50px',
                'border-radius': '4px',
                'background-color': '#21bd73'
              }
            })
            window.location.href = '/stu'
          } else {
            this.errMsg = res.info
          }
        })
      }
    },
    close () {
      this.$emit('disappear', 0)
    },
    clearMs () {
      this.$refs.selectSchool.setVal(0)
    },
    fromChild (prop) {
      this.gender = parseInt(prop)
      if (parseInt(prop) === 1) {
        this.defaultSex = true
      } else {
        this.defaultSex = false
      }
    },
    getSF () {
      this.$jsonp('/Student/getRegion?province_id=all', {}, (err, res) => {
        if (res.status === 1) {
          this.areaArr = res.data
          let sfList = [
            {
              id: 0,
              name: '请选择省'
            }
          ]
          for (let i = 0; i < res.data.length; i++) {
            let sfMsg = res.data[i]
            sfList.push({
              id: sfMsg.id,
              name: sfMsg.name
            })
          }
          this.$refs.sf.setList(sfList)
          this.$refs.sf.setVal(res.data[0].id)
        } else {
          console.log(err)
        }
      })
    },
    collectInfo () {
      perfectInfo.stuName = this.name
      perfectInfo.stuIDNo = this.idNumber
      perfectInfo.cityId = this.$refs.qy.getVal()
      perfectInfo.schoolName =
        this.$refs.selectSchool.getText() || this.schoolName
      perfectInfo.schoolId = this.$refs.selectSchool.getVal()
      perfectInfo.classId = this.$refs.class.getVal()
      perfectInfo.className = this.$refs.class.getText()
      perfectInfo.cateName = this.$refs.categroy.getText()
      perfectInfo.teaName = this.teachName
      perfectInfo.gender = this.gender
      perfectInfo.postAssessmentUrl =
        this.$config.jdcpIP + 'WebCompetition/saveStuInfo'
    },
    getVerify () {
      this.errText.stuNameErrMsg = ''
      this.errText.idNumberErrMsg = ''
      this.errText.teaNameErrMsg = ''
      this.errText.teaNumberErrMsg = ''
      this.errText.areaErrMsg = ''
      this.errText.schoolErrMsg = ''
      this.errText.categoryErrMsg = ''
      this.errText.classErrMsg = ''
      if (!this.name) {
        this.errText.stuNameErrMsg = this.$t(
          'Login.perfect.error.stuNameErrMsg'
        )
        return false
      } else if (
        !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(
          this.idNumber
        )
      ) {
        this.errText.idNumberErrMsg = this.$t(
          'Login.perfect.error.idNumberErrMsg'
        )
        return false
      } else if (
        !this.$refs.qy.getVal() &&
        !this.$refs.sf.getVal() &&
        !this.$refs.sq.getVal()
      ) {
        this.errText.areaErrMsg = this.$t('Login.perfect.error.areaErrMsg')
        return false
      } else if (
        this.$refs.selectSchool.getText() === '请选择学校' &&
        this.schoolName === ''
      ) {
        this.errText.schoolErrMsg = this.$t('Login.perfect.error.schoolErrMsg')
        return false
      } else if (this.$refs.categroy.getText() === '请选择所在年级') {
        this.errText.categoryErrMsg = this.$t(
          'Login.perfect.error.categoryErrMsg'
        )
        return false
      } else if (this.$refs.class.getText() === '请选择所在班级') {
        this.errText.classErrMsg = this.$t('Login.perfect.error.classErrMsg')
        return false
      } else if (!this.teachName) {
        this.errText.teaNameErrMsg = this.$t(
          'Login.perfect.error.teaNameErrMsg'
        )
        return false
      } else {
        return true
      }
    }
  },
  mounted () {
    this.getSF()
  }
}
</script>
<style lang="less">
@image-url: '../../../../assets/image/common';
#perfect {
  position: fixed;
  z-index: 99;
  width: 100%;
  align-items: flex-start;
  #close {
    position: absolute;
    right: 70px;
    top: 50px;
    cursor: pointer;
    z-index: 999;
  }
  .contain {
    position: fixed;
    text-align: center;
    z-index: 100;
    width: 100%;
    margin-top: 130px;
    img {
      margin-left: 118px;
    }
    p.title {
      font-size: 24px;
      color: #666;
      line-height: 30px;
      margin-top: 26px;
      margin-bottom: 30px;
      margin-left: 118px;
    }
    p.msg1 {
      line-height: 32px;
      margin-bottom: 8px;
      margin-left: 126px;
      margin-left: 135px;
    }
    p.attention {
      font-size: 14px;
      color: #ff9900;
      line-height: 20px;
      margin-top: 12px;
      margin-bottom: 48px;
      margin-left: 8px;
    }
    button {
      width: 330px;
      height: 50px;
      border-radius: 4px;
      color: #fff;
      font-size: 18px;
      background: linear-gradient(to right, #21bd73, #46bf97);
      margin-left: 118px;
    }
    p.errMsg {
      color: #fa4b4b;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .row {
      margin: 0 auto;
      margin-bottom: 10px;
      position: relative;
      width: 1000px;
      display: flex;
      justify-content: center;
      label {
        line-height: 40px;
        margin-right: 20px;
        text-align: right;
        display: inline-block;
        span {
          color: red;
          margin-right: 6px;
        }
      }
      .errTips {
        color: #fa4b4b;
        font-size: 14px;
        display: flex;
        align-items: center;
        position: absolute;
        right: 110px;
        top: 8px;
      }
      input {
        width: 370px;
        height: 40px;
        padding-left: 10px;
        font-size: 16px;
        margin-right: 10px;
      }
      &.name {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 277px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
        }
      }
      &.sex {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 290px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
        }
      }
      &.idNumber {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 260px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
        }
      }
      &.teach {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 245px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
        }
      }
      &.phone {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 245px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
          label {
            margin-left: 12px;
          }
        }
      }
      &.areafilter {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 245px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
          div {
            margin-right: 10px;
          }
        }
      }
      &.schoolfilter {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0;
        .left {
          height: 40px;
          width: 245px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
          div {
            margin-right: 10px;
          }
          & > span {
            margin-right: 10px;
          }
        }
        & > span {
          margin-right: 20px;
        }
        & > input {
          width: 240px;
        }
      }
      &.categroyFilter,
      &.classFilter {
        display: flex;
        justify-content: center;
        align-items: center;
        .left {
          height: 40px;
          width: 245px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: flex-start;
          align-items: center;
        }
      }
      &.sex {
        text-align: left;
        & > label {
          margin-left: -207px;
        }
        div.radio {
          display: inline-block;
          padding-left: 20px;
          & > label {
            width: auto;
            padding-left: 10px;
            margin-right: 30px;
            &.selected {
              color: #21bd73;
            }
          }
        }
      }
    }
  }
}
</style>