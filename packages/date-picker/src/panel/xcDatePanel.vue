<template>
  <div class="p-datePanel">
    <input type="text" :value="ss__value" ref="input">
  </div>
</template>

<script>
import Vue from 'vue';
import DatePanel from './date';
import { formatDate, parseDate, isDateObject, getWeekNumber } from '../util';

const DATE_FORMATTER = function(value, format) {
  if (format === 'timestamp') return value.getTime();
  return formatDate(value, format);
};
const DATE_PARSER = function(text, format) {
  if (format === 'timestamp') return new Date(Number(text));
  return parseDate(text, format);
};
const RANGE_FORMATTER = function(value, format) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)];
    }
  }
  return '';
};
const RANGE_PARSER = function(array, format, separator) {
  if (!Array.isArray(array)) {
    array = array.split(separator);
  }
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)];
  }
  return [];
};
const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    }
  },
  week: {
    formatter(value, format) {
      let week = getWeekNumber(value);
      let month = value.getMonth();
      const trueDate = new Date(value);
      if (week === 1 && month === 11) {
        trueDate.setHours(0, 0, 0, 0);
        trueDate.setDate(trueDate.getDate() + 3 - (trueDate.getDay() + 6) % 7);
      }
      let date = formatDate(trueDate, format);

      date = /WW/.test(date)
        ? date.replace(/WW/, week < 10 ? '0' + week : week)
        : date.replace(/W/, week);
      return date;
    },
    parser(text) {
      const array = (text || '').split('w');
      if (array.length === 2) {
        const year = Number(array[0]);
        const month = Number(array[1]);

        if (!isNaN(year) && !isNaN(month) && month < 54) {
          return text;
        }
      }
      return null;
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  number: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      let result = Number(text);

      if (!isNaN(text)) {
        return result;
      } else {
        return null;
      }
    }
  },
  dates: {
    formatter(value, format) {
      return value.map(date => DATE_FORMATTER(date, format));
    },
    parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value)
        .map(date => date instanceof Date ? date : DATE_PARSER(date, format));
    }
  }
};

const formatAsFormatAndType = (value, customFormat, type) => {
  console.log('print value, customFormat, type')
  console.log(value)
  console.log(customFormat)
  console.log(type)
  if (!value) return null;
  const formatter = (
    TYPE_VALUE_RESOLVER_MAP[type] ||
    TYPE_VALUE_RESOLVER_MAP['default']
  ).formatter;
  const format = customFormat || DEFAULT_FORMATS[type];
  return formatter(value, format);
};


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

      // this.picker.$watch('selectedDate', val => {
      //   this.ss__value = val;
      //   self.$emit('input', this.ss__value);
      //   console.warn(this.ss__value)
      // })

      this.picker.$on('handleDateSelect', val => {
        val = this.formatToValue(val);
        if(self.type === 'dates') {
          self.ss__value = val;
          self.$emit('input', val);
        }
      })


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
