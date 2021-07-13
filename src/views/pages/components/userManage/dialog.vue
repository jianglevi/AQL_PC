<template>
  <el-dialog
    :title="title"
    :visible.sync="setVisible"
    width="1000px"
    @closed="closeDialog"
    :close-on-click-modal="false"
  >
    <el-row
      v-for="(row, Index) in formFields"
      :key="Index + 'row1'"
      style="padding-top: 16px"
    >
     <div v-for="(item,i) in row" :key="i+'index'">
       <form-item
         v-bind:config="item"
         :value.sync="saveData[item.name]"
       ></form-item>
     </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog" size="mini">确 定</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import formItem from "../common/dialogForm.vue";
import { apiRequest } from "@/api/pagesApi/openBilling.js";
const roleStatus = [
  {label:'开启',value:1},
  {label:'禁用',value:0},
]
let roleSelectList = []
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
            this.saveData.password = ""
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
          [
            { title: "用户名", name: "username",type: "input",span:12,width:"330px"},
            { title: "昵称", name: "nickname",type: "input",span:12,width:"330px"},
          ],
          [
            { title: "创建日期", name: "createtime",type: "datetimes",span:12,width:"330px"},
            { title: "客户", name: "organizationName",type: "input",span:12,width:"330px"},
          ],
          [
            { title: "一指通路径", name: "yztUrl",type: "input",span:12,width:"330px"},
            { title: "一指通用户名", name: "yztUsername",type: "input",span:12,width:"330px"},
          ],
          [
            { title: "一指通密码", name: "yztPassword",type: "input",span:12,width:"330px"},
            { title: "状态", name: "available",range: roleStatus, type: "picker_same",span:12 },
          ],
          [
            { title: "角色名", name: "roles",range: roleSelectList, type: "picker_same",span:12,multiple:true},
            { title: "用户名密码", name: "password",type: "input",span:12,width:"330px",password:true},
          ]
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
        user: this.saveData,
        type: 'user',
        list: this.saveData.roles
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
    apiRequest('query/roleSelect').then(res => {
       roleSelectList = res.data
      })
    }
};
</script>
<style scoped lang="scss">

</style>