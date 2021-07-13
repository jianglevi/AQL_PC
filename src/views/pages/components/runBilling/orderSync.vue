<template>
  <el-dialog
    :title="title"
    :visible.sync="setVisible"
    width="600px"
    @closed="closeDialog"
    :close-on-click-modal="false"
  >
    <el-row
      v-for="(item, Index) in formFields"
      :key="Index + 'row1'"
      style="padding-top: 16px"
    >
      <form-item
        v-bind:config="item"
        @input="formInput"
        @select="formSelect"
        @consignPicker="consignPicker"
        :value.sync="item[item.name]"
      ></form-item>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import formItem from "../common/dialogForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    setVisible: {
      get() {
        //回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
        return this.visible;
      },
      set(val) {
        //监视当前属性值的变化，当属性值发生变化时执行，更新相关的属性数据
        //val就是fullName3的最新属性值
        this.$emit("update:visible", val);
      },
    },
  },
  components: { formItem },
  data() {
    return {
      // 同步
      formFields: [
          {
            type: "picker_same",
            name: "consignerName",
            title: "发货方姓名",
            event: "consignPicker",
            span: 21,
          },
          {
            type: "picker_same",
            name: "consigneeName",
            title: "收货方姓名",
            event: "consignPicker",
            span: 21,
          },
          {
            type: "datetimes",
            name: "beginDate",
            title: "开始时间",
            span: 21,
          },
          {
            type: "datetimes",
            name: "endDate",
            title: "结束时间",
            span: 21,
          }
      ],
      saveData:{},
    };
  },
  methods: {
    closeDialog() {
      this.setVisible = false;
    },
    submitDialog() {
      var that = this
      fetchList('order/sync', 'get', that.saveData).then(res => {
        if(res.result) {
          this.closeDialog()
        }
      })
    },
    formInput(config, val) {
      this.saveData[config.name] = val;
    },
    formSelect(config, val) {
      this.saveData[config.name] = val;
    },
    formSelectArea(config, val) {
      this.saveData[config.name] = val;
    },
    consignPicker(config,val){
      this.saveData[config.name] = val;
    },  
    optionSet(){
      var options = {value: 'name', label: 'name', table: 'erp_customer'}
      fetchList('order/options', 'get', options).then(res => {
        if(res.result) {
          this.formFields[0].range = res.data
          this.formFields[1].range = res.data
        }
      })
    },
  },
  created() {
    this.optionSet()
  },
};
</script>
<style scoped lang="scss">

.title {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #1890ff;
  font-size: 14px;
  height: 35px;
  width: 99%;
  line-height: 35px;
  margin-left: 20px;
  position: relative;
  .tag {
    margin-left: 20px;
    border: 1px solid #1890ff;
    color: #1890ff;
    width: 55px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }
  .operation {
    color: #1890ff;
    display: flex;
    align-items: center;
  }
}
.title::after {
  height: 2px;
  content: "";
  background: #f2f2f2;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.title .line {
  z-index: 10;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  height: 2px;
}
</style>