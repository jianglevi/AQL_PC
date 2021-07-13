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
        :value.sync="saveData[item.name]"
      ></form-item>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog" size="mini">确 定</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import formItem from "../common/dialogForm.vue";
import { apiRequest } from "@/api/pagesApi/openBilling.js"
const roleStatus = [
  {label:'开启',value:1},
  {label:'禁用',value:0},
]
const api = {
  add:{
    url:"index/insert",
    type:"post"
  },
  edit:{
    url:"index/update",
    type:"post"
  }
}
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
    typeConfig:{
      type:Object
    }
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
  watch:{
    visible:{
      handler(newVal){
        if(newVal){
          if(this.typeConfig.id){
            this.saveData = {...this.typeConfig}
          }else{
            this.saveData = {}
          }
        }
      },
      immediate:true
    }
  },
  components: { formItem },
  data() {
    return {
      // 同步
      formFields: [
          {
            type: "input",
            name: "name",
            title: "角色名",
            span: 20,
            width: '330px'
          },
          {
            type: "input",
            name: "description",
            title: "描述",
            span: 20,
            width: '330px'
          },
          {
            type: "picker_same",
            name: "available",
            title: "状态",
            span: 20,
            range:roleStatus
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
      let data = {
        role: this.saveData,
        type: 'role'
      }
      apiRequest(this.saveData.id ? api.edit.url : api.add.url, '',"post", data).then(res => {
        if(res.result) {
          this.$emit('updateTable')
        }
        this.closeDialog()
      })
    },
  },
  created() {
  },
};
</script>
<style scoped lang="scss">

</style>