<template>
  <el-dialog
    :title="title"
    :visible.sync="setVisible"
    width="600px"
    @closed="closeDialog"
    :close-on-click-modal="false"

  >
<el-tree
  :data="accessList"
  show-checkbox
  node-key="id"
  ref="tree"
  :default-checked-keys="idList"
  auto-expand-parent
  :props="defaultProps">
</el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog" size="mini">确 定</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { apiRequest } from "@/api/pagesApi/openBilling.js"
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
  watch:{
    visible:{
      handler(newVal){
        if(newVal){
          apiRequest("query/resourceOfRole",{role:this.typeConfig.id}).then(res => {
            if(res.result) {
              this.idList = res.data.filter(item=> !this.detachId.includes(item))
            }
          })
        }
      },
      immediate:true
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
  data() {
    return {
      defaultProps: {
        children: 'subs',
        label: 'title',
      },
      accessList:[],
      saveData:{},
      idList:[],
      detachId:[]
    };
  },
  methods: {
    closeDialog() {
      this.setVisible = false;
      this.$refs.tree.setCheckedKeys([])
    },
    submitDialog() {
      let idList = this.$refs.tree.getCheckedKeys()
      let data = {
        resources: idList,
        role: this.typeConfig.id
      }
      apiRequest("index/resourceAssociate","","POST",data).then(res => {
        if(res.result) {
          this.closeDialog()
        }
      })
    },
  },
  created(){
    apiRequest("query/sysResource").then(res=>{
        this.accessList = res.data
        this.detachId = res.data.map(item=>item.id)
    })
  },
};
</script>
<style scoped lang="scss">
</style>