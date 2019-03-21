<template lang="pug">
    ul
        li(
        @click.stop="handleClick(item.value)"
        v-for="item in options"
        ) {{item.value}}
</template>
<script>
export default {
  props: ['options'],
  inject: ['select'],
  mounted() {},
  methods: {
    handleClick(value) {
      this.select.$emit('handleselect', value)
    }
  }
}
</script>
