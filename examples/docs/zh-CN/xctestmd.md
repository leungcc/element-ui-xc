### 基本用法

页面中的非浮层元素，不会自动消失

:::demo Alert 组件提供四种主题，由`type`属性指定，默认值为`info`
```html
<template>
  <el-alert
    title="成功提示的文案"
    type="success">
  </el-alert>
  <el-alert
    title="消息提示的文案"
    type="info">
  </el-alert>
  <el-alert
    title="警告提示的文案"
    type="warning">
  </el-alert>
  <el-alert
    title="错误提示的文案"
    type="error">
  </el-alert>
</template>
```
:::

### 测试 DatePanel

像time-picker一样引入 date-picker文件夹内的文件
:::demo
```html
<template>
  <div>
    <el-date-panel 
      v-model="datess"
      type="dates"
      value-format="HH:mm:ss"
    ></el-date-panel><!--v-model="datess"-->
  </div>
</template>
<script>
  export default {
    mounted() {
      const self = this;
      console.log('!!!!')
      setInterval(() => {
        console.log(self.datess);
      }, 5*1000)
    },
    data() {
      return {
        datess: []
      }
    },
    watch: {
      datess(val) {
        console.log(val);
      }
    }
  }
</script>
```
:::