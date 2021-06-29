<template>
  <el-dialog
    :title="title"
    :visible.sync="setVisible"
    width="600px"
    @closed="closeDialog"
    :close-on-click-modal="false"
    v-loading="loading"
  >
		<el-form  size="mini" label-width="120px">
      <br>
      <el-form-item label="导入: ">
        <el-input 
          v-model="fileName"
          clearable
          :style="{width:'360px'}"
          @input="input"
        >
        <template slot="append">
          <el-upload
            action="dataImportFiles"
            name="file"
            :data="uploadExcel"
            :auto-upload="false"
            accept=".xls,.xlsx"
            :on-change="fileChange"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :show-file-list="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </template>
        </el-input>
      </el-form-item>
      <el-form-item label="字段名行:">
          <el-input 
          v-model="fieldRow"
          clearable
          :style="{width:config.width ? config.width : '220px'}"
          @input="input"
        ></el-input>
      </el-form-item>
      <el-form-item label="第一个数据行:">
          <el-input 
          v-model="fstDataRow"
          clearable
          :style="{width:config.width ? config.width : '220px'}"
          @input="input"
        ></el-input>
      </el-form-item>
      <el-form-item label="最后一个数据行:">
          <el-input 
          v-model="endDataRow"
          clearable
          :style="{width:config.width ? config.width : '220px'}"
          @input="input"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择目标表:">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="data"
              label="源数据"
              width="180px">
            </el-table-column>
            <el-table-column
              prop="target"
              label="目标表">
              <!-- <template slot-scope="scope">
                <el-select 
                v-model="scope.row.target" 
                placeholder="请选择"
                size="mini">
                  <el-option 
                    v-for="(item,index) in targetTables"
                    :key="index" 
                    :label="item.label" 
                    :value="item.value">
                  </el-option>
                </el-select>
              </template> -->
            </el-table-column>
          </el-table>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  size="small" type="primary"  @click="closeDialog" >取 消</el-button>
        <el-button size="small" type="primary" @click='importSubmit'>导入</el-button>	
    </span>
  </el-dialog>
</template>
<script>
import formItem from "../common/dialogForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js"
import { postRequest } from "@/api/pagesApi/openBilling.js"
export default {
  props: {
    type: String,
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
  components: {
    formItem
  },
  data() {
    return {
      // 同步
      tableData: [
        {
          data: '',
          target: ''
        }
      ],
      config: {
        width: '220px'
      },
      fileName:'',
      fieldRow: 1,
      fstDataRow: 2,
      endDataRow: '',
      uploadExcel: {msg:''},
      file:'',
      fileList: [],
      targetTables: [
        {
          value: 'erp_customer',
          label: '客户表'
        },
        {
          value: 'erp_driver',
          label: '司机表'
        },
      ],
      loading: false
    };
  },
  methods: {
    fileChange(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.file = file
      this.fileName = file.name
      if(fileList.length>0) {
        this.fileList = [fileList[fileList.length-1]]
      }
      console.log(this.fileList)
      let data = new FormData()
      data.append('multipartFile', file.raw)
      postRequest('import/dataSources', data, {'Content-Type': 'multipart/form-data'}).then(res => {
        if(res.result) {
          console.log(173)
          console.log(res.data)
          console.log(this.type)
          this.tableData[0].data = res.data[0]
          // this.tableOptions()
        }
      })
    },
    beforeUpload(file) {
      console.log(file)
    },
    importSubmit(val) {
      console.log(val)
      if(this.file=='') {
        alert('未选择文件')
        return
      }
      if(this.tableData[0].data=='') {
        alert('表格无数据')
        return
      }
      if(this.fieldRow=='') {
        alert('未输入标题行')
        return
      }
      if(this.fstDataRow=='') {
        alert('未输入第一个数据行')
        return
      }
      if(this.tableData[0].target=='') {
        alert('目标表为空')
        return
      }
      const confirmText = ['~ 追加: 添加记录到目标表', '是否继续?'] 
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      this.$confirm('tips', {
        title: '提示',
        message: h('div', null, newDatas),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        this.loading = true
        let data = new FormData()
        let msg = {
          fieldRow: this.fieldRow,
          fstDataRow: this.fstDataRow,
          endDataRow: this.endDataRow,
          type: this.tableData[0].target
        }
        data.append('msg', JSON.stringify(msg))
        data.append('multipartFile', this.file.raw)
        postRequest('import/excel', data, {'Content-Type': 'multipart/form-data'}).then(res => {
          if(res.result) {
            console.log(res.data)
            this.loading = false
          }
        })
      })
    },
    tableOptions(){
      let targetTables = {value: 'convalues', label: 'conKey', table: 'sys_parameterconfigure', condy:"and name='table'"}
      fetchList('order/options', 'get', targetTables).then(res => {
        if(res.result) {
          console.log(res.data)
          this.targetTables = res.data
        }
      })
    },
    handleChangeConfig(val){
      console.log(val)
    },

    closeDialog() {
      this.setVisible = false;
    },
    input(val) {
      console.log(val)
    },
    optionSet(){

    },
    typeTarget(){
      console.log(262)
      switch(this.type) {
        case 'driver':
          this.tableData[0].target = '司机管理'
          break
        case 'customer':
          this.tableData[0].target = '客户管理'
          break
        case 'intervalTime':
          this.tableData[0].target = '地址间距时长'
          break
        case 'singleModel':
          this.tableData[0].target = '单品管理'
          break
        default:
          break
      }
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
}
</style>