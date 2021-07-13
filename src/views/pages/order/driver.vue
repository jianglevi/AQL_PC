<template>
  <div class="runBilling">
    <!-- 查询 -->
    <div class="search_container">
      <run-billing-search-form
        :config.sync="searchForm"
        @setSearchForm="setSearch"
      />
    </div>
    <!-- 表格按钮 -->
    <div class="table_btn">
      <el-button
        v-for="item in tableBtn"
        :key="item.title"
        @click="buttonClick(item.event)"
        size="mini"
        :type="item.type"
        :icon="'el-icon-' + item.icon"
        class="btn"
        plain
        >{{ item.title }}</el-button
      >
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        size="mini"
        class="table_content"
        :data="tableData"
        border
        @select="selectTableList"
        @select-all="selectTableList"
        :row-style="{ height: '40px' ,padding:0}"
        :cell-style="{ padding: '0 0' }"
        height="600"
        style="width: 100%"
        :header-cell-style="{ color: '#333', padding: '5px 0' }"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.title"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :width="item.width"
          sortable
        >
        </el-table-column>
      </el-table>
      <el-pagination
        class="table_Pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[ 20, 50, 100 ,200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.pageTotal"
      >
      </el-pagination>
    </div>
    <!-- 导入 -->
    <div class="dialog">
      <excelImport
        ref="importDialog"
        :type="type"
        :visible.sync="importDialog.visible"
        :title.sync="importDialog.title"
        @search="setSearch"
      />
    </div>
  </div>
</template>
<script>
import runBillingSearchForm from "@/views/pages/components/common/searchForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js";
import excelImport from "@/views/pages/components/common/ExcelImport.vue";
export default {
  name: "runBilling",
  components: {
    runBillingSearchForm,
    excelImport
  },
  data() {
    return {
      type: 'driver',
      searchForm: [
        {
          title: "司机姓名",
          type: "input",
          name: "driverName",
        },
        {
          title: "关联车辆",
          type: "input",
          name: "associatedVehicle",
        },
      ],
      search: {},
      tableBtn: [
        // { icon: "plus", event: "insert", title: "新增", type: "primary" },
        // { icon: "edit", event: "updated", title: "修改", type: "warning" },
        { icon: "document-delete", event: "deleted", title: "删除", type: "danger" },
        { icon: "s-data", event: "excelImportData", title: "导入", type: "primary" },
      ],
      tableColumn: [
        { label: "司机姓名", prop: "driverName", width: 120 },
        { label: "手机号", prop: "driverPhone", width: 180 },
        { label: "身份证号", prop: "identityNumber", width: 180 },
        { label: "身份证生效日期", prop: "identityEffectiveDate", width: 180 },
        { label: "身份证失效日期", prop: "identityExpiraDate", width: 180 },
        { label: "有效合同", prop: "validContract", width: 180 },
        { label: "从业资格证号", prop: "certificateNo", width: 180 },
        { label: "驾驶证编号", prop: "drivingLicense", width: 180 },
        { label: "准驾车型", prop: "driverModel", width: 180 },
        { label: "驾驶证生效日期", prop: "licenseEffectiveDate", width: 180 },
        { label: "驾驶证失效日期", prop: "licenseExpiraDate", width: 180 },
        { label: "驾驶证发证机关", prop: "licenseIssuing", width: 300 },
        { label: "身份证住址", prop: "identityAddress", width: 300 },
        { label: "关联车辆", prop: "associatedVehicle", width: 180 },
        { label: "关联收款人", prop: "relatedPayee", width: 180 },
        { label: "备注", prop: "remark", width: 180 },
      ],
      tableData: [],
      tableList: [],
      page: {
        pageSize: 20,
        pageTotal: 0,
        currentPage: 1,
      },
      sql: '',
      importDialog: {
        title: '司机信息导入',
        visible: false
      }
    };
  },
  methods: {
    setSearch(val) {
      this.sql = ''
      if(val!=undefined){
        this.handleConditions(val)
      }
      var obj = {
        conditions: this.sql,
        page: this.page.currentPage,
        size: this.page.pageSize,
      }
      fetchList('/query/erpDriver', 'post', null, obj).then(res=>{
        if(res.result) {
          this.tableData = res.data
          this.page.pageTotal = res.map.total
          this.tableList = []
        }
      })
    },
    buttonClick(name) {
      this[name]();
    },
    table() {
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.setSearch()
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
      this.setSearch()
    },
    selectTableList(list) {
      this.tableList = list.map(item=>item.id);
    },
    handleConditions(val) {
      for(let i in val) {
        this.searchForm.forEach(item =>{
          if(item.name==[i]) {
            if(item.type=='input') {
              if(val[i]!=undefined) {
                this.sql += " and " + [i] + " like '%" + val[i] + "%'"
              }
            }
          }
        })
      }
    },
    insert() {
    },
    updated() {
    },
    deleted(){
      console.log(this.tableList)
      if(this.tableList.length<1) {
        this.$message({
          message: '请选择要删除的记录',
          type: 'warning'
        });
        return
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
  
      let params = {
        type: this.type,
        id: this.tableList.join(',')
      }
      fetchList('index/delete', 'get', params).then(res=>{
        if(res.result){
        this.$message({
                type: 'success',
                message: '删除成功!'
          });
          this.setSearch()
        }
      })
      })
  
    },
    excelImportData(){
      this.$refs['importDialog'].typeTarget()
      this.importDialog.visible = true
    },
  },
  mounted() {
    this.setSearch()
  },
};
</script>
<style lang="scss" scoped>
.search_container label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100px;
}

.el-dialog__header {
  padding: 0px;
  padding-bottom: 10px;
}
.runBilling {
  padding: 28px 28px 40px 28px;
  box-sizing: border-box;
}
.search_container {
  width: 100%;
}
.table_btn {
  padding: 0 0 10px 0;
}
.table_btn .btn {
  margin-right: 10px;
}
.table {
  display: flex;
  flex-direction: column;
  height: 70vh;
}
.table_content {
  overflow: auto;
}
.table_Pagination {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
