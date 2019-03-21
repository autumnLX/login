<template lang="pug">
div.form-input(:class="{errorColor: ErrorColorFlag}")
    div
      slot(name="icon")
    input(
      ref="input"
      :placeholder="placeholder",
      :value="currentValue"
      :autofocus="autofocus"
      :type="type"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keyup.enter="$emit('enter',$event)")
    i.icon.icon_delete(v-if="showClear" @click="clear")
</template>
<script>
export default {
  name: 'KmInput',
  data() {
    return {
      ErrorColorFlag: false,
      currentValue:
        this.value === undefined || this.value === null ? '' : this.value
    }
  },
  props: {
    value: [String, Number],
    showClearIcon: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    autofocus: Boolean,
    rule: Array,
    type: String
  },
  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val)
    }
  },
  computed: {
    showClear() {
      return (
        this.showClearIcon && (this.currentValue || this.currentValue === 0)
      )
    }
  },
  methods: {
    check() {
      this.ErrorColorFlag =
        this.currentValue === undefined ||
        this.currentValue === null ||
        this.currentValue === ''
      return !this.ErrorColorFlag
    },
    setCurrentValue(value) {
      this.ErrorColorFlag = false
      this.currentValue = value
    },
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    clear() {
      this.setCurrentValue('')
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
      this.focus()
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleInput(event) {
      const value = event.target.value
      this.setCurrentValue(value)
      this.$emit('input', value)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.form-input {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 2px;
  line-height: 40px;
  background: #fff;
  .icon {
    width: 20px;
    height: 20px;
    background: url('/static/login/images/icon_login.png');
  }
  .icon_delete {
    display: block;
    position: absolute;
    top: 50%;
    right: 10px;
    margin-top: -10px;
    background-position: -42px -1px;
    cursor: pointer;
  }

  &.password {
    margin-top: 20px;
  }

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 38px;
    background-color: #f8f8f8;

    .icon_username {
      background-position: 0 -1px;
    }

    .icon_password {
      background-position: -20px -1px;
    }
  }

  & > input {
    width: 208px;
    height: 38px;
    padding: 0;
    padding-left: 10px;
    padding-right: 38px;
    border: none;
    color: #666;
    font-size: 16px;
    line-height: 40px;
    outline: none;

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px white inset !important;
    }
  }
}
</style>
