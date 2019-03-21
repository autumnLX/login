<template lang="pug">
    div.km-select
      div.input-warp
        input(
        ref="input"
        v-clickoutside="close"
        :class="{select:!filterable}"
        :readonly="!filterable"
        :placeholder="placeholder"
        :value="value"
        type="text"
        @blur="handleBlur"
        @focus= "handleFocus"
        )
        transition(name="option")
          div.km-options(v-if="showOption")
                slot
</template>
<script>
import clickoutside from '@/directives/clickoutside.js'
export default {
  name: 'KmSelect',
  props: {
    filterable: {
      type: Boolean,
      default: false
    },
    placeholder: ''
  },
  directives: {
    clickoutside
  },
  provide () {
    return {
      select: this
    }
  },
  data () {
    return {
      showOption: false,
      value: ''
    }
  },
  methods: {
    handleBlur () {
      setTimeout(() => {
        this.showOption = false
      }, 50)
    },
    handleFocus () {
      this.showOption = true
    },
    close () {
      console.log(222)
    }
  },
  mounted () {
    this.$on('handleselect', value => {
      this.value = value
    })
  }
}
</script>
<style lang="less" scoped>
.km-select {
  position: absolute;
  z-index: 2000;
}
.input-warp {
  border: 1px solid #ccc;
}

input {
  background: none;
  outline: none;
  border: 0px;
  display: block;
  height: 100%;
  width: 100%;
}
.select {
  cursor: pointer;
}
.km-options {
  position: absolute;
}
.option-enter-active,
.option-leave-active {
  transition: opacity 0.5s;
}
.option-enter,
.option-leave-to {
  opacity: 0;
}
</style>
