<template>
  <div class="define-page">
    <avue-crud :data="data" :option="option"></avue-crud>
  </div>
</template>
<script>
import DropdownMenu from "@/components/Share/DropdownMenu";
import echarts from "echarts";
require("echarts/theme/macarons");
import bus from "@/utils/bus.js";
export default {
  name: "client",
  components: { DropdownMenu },
  data() {
      return {
        data: [
          {
            name:'张三',
            sex:'男',
            date:'1994-02-23 00:00:00'
          }, {
            name:'李四',
            sex:'女',
            date:'1994-02-23 00:00:00'
          }, {
            name:'王五',
            sex:'女',
            date:'1994-02-23 00:00:00'
          }, {
            name:'赵六',
            sex:'男',
            date:'1994-02-23 00:00:00'
          }
        ],
        option:{
          title:'表格的标题',
          titleSize:'h3',
          titleStyle:{
            color:'red'
          },
          page:false,
          align:'center',
          menuAlign:'center',
          column:[
            {
              label:'姓名',
              prop:'name'
            },
            {
              label:'性别',
              prop:'sex'
            },{
              label: "日期",
              prop: "date",
              type: "date",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
            }
          ]
        }
      }
  },
  methods(){

  },
  mounted() {
    
  }
};
</script>
<style lang="scss" scoped>
.define-page {
  
}
</style>
