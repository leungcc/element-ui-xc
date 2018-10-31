<template>
  <div class="p-datePanel">
    <input type="text" :value="ss__value" ref="input">
  </div>
</template>

<script>
import Vue from 'vue';
import DatePanel from './date';
import { formatDate, parseDate, isDateObject, getWeekNumber } from '../util';


export default {
  name: 'ElDatePanel',
  props: {
    value: Array,
    type: String,
    valueFormat: String
  },
  data() {
    return {
      picker: null,
      format: null,
      ss__value: null,
    }
  },

  created() {
    this.ss__value = this.value;
  },

  mounted() {
    
    
    this.mountPicker();

  },

  methods: {
    /**
     * @desc 初始化 datePanel
     */
    mountPicker() {
      const self = this;

      this.picker = new Vue(DatePanel).$mount();
      this.picker.defaultValue = null;
      this.picker.defaultTime = null;
      this.picker.popperClass = null;
      this.popperElm = this.picker.$el;
      this.picker.width = 220;
      this.picker.showTime = false;
      this.picker.selectionMode = 'dates';
      this.picker.unlinkPanels = false;
      this.picker.arrowControl = false;
      this.picker.selectedDate = Array.isArray(this.value) && this.value || [];
      this.$watch('format', (format) => {
        this.picker.format = format;
      });

      this.picker.$watch('selectedDate', val => {
        this.ss__value = val;
        self.$emit('input', this.ss__value);
        //self.$emit('change', this.ss__value);
        console.warn(this.ss__value)
      })

      // this.picker.$on('handleDateSelect', val => {
      //   if(self.type === 'dates') {
      //     console.log('....')
      //     self.ss__value = val;
      //     self.$emit('input', val);
      //   }
      // })


      //这个DatePanel得始终显示
      this.picker.visible = true;

      this.$el.appendChild(this.picker.$el);

      //事件相关
      this.picker.$on('dodestroy', this.doDestroy);
      this.picker.$on('pick', (date = '', visible = false) => {
        this.userInput = null;
        //this.pickerVisible = this.picker.visible = visible;
        this.emitInput(date);
        this.picker.resetView && this.picker.resetView();
      });

    },

    /**
     * @desc 格式化日期
     */
    formatToValue(date) {
      const isFormattable = isDateObject(date) || (Array.isArray(date) && date.every(isDateObject));
      if (this.valueFormat && isFormattable) {
        return formatAsFormatAndType(date, this.valueFormat, this.type, this.rangeSeparator);
      } else {
        return date;
      }
    }
  }
}
</script>

<style>

</style>
