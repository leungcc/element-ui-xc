<template>
  <transition :name="disableTransitions ? '' : 'el-zoom-in-center'">
    <span
      class="el-tag"
      :class="[
        type ? 'el-tag--' + type : '',
        tagSize && `el-tag--${tagSize}`,
        {'is-hit': hit}
      ]"
      :style="{backgroundColor: color}">
      <slot></slot>
      <i class="el-tag__close el-icon-close"
        v-if="closable && !readMode"
        @click.stop="handleClose"></i>
    </span>
  </transition>
</template>
<script>
  export default {
    name: 'ElTag',
    props: {
      readMode: Boolean,  //xc add props: 有该属性不显示 "x" 关闭按钮
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      disableTransitions: Boolean,
      color: String,
      size: String
    },
    methods: {
      handleClose(event) {
        this.$emit('close', event);
      }
    },
    computed: {
      tagSize() {
        return this.size || (this.$ELEMENT || {}).size;
      }
    }
  };
</script>
