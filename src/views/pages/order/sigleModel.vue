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
        :page-sizes="[ 20, 50, 100, 200]"
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
import excelImport from "@/views/pages/components/common/ExcelImport.vue"
export default {
  name: "runBilling",
  components: {
    runBillingSearchForm,
    excelImport
  },
  data() {
    return {
      type: 'singleModel',
      searchForm: [
        {
          title: "单品名称",
          type: "input",
          name: "itemName",
        }
      ],
      search: {},
      tableBtn: [
        { icon: "document-delete", event: "deleted", title: "删除", type: "danger" },
        { icon: "s-data", event: "excelImportData", title: "导入", type: "primary" },
      ],
      tableColumn: [
        { label: "单品名称", prop: "itemName" },
        { label: "单品重量", prop: "unitWeight" },
        { label: "单品体积", prop: "unitVolume" },
        { label: "单品货值", prop: "unitValue" },
        { label: "单品类型", prop: "type" },
        { label: "货物备注1", prop: "cargoNote1" },
        { label: "货物备注2", prop: "cargoNote2" },
        { label: "货物备注3", prop: "cargoNote3" },
        { label: "货物备注4", prop: "cargoNote4" },
        { label: "货物备注5", prop: "cargoNote5" },
        { label: "货物备注6", prop: "cargoNote6" },
        { label: "用户", prop: "userName" },
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
        title: '单品信息导入',
        visible: false
      }
    };
  },
  methods: {
    setSearch(val) {
      this.sql = ''
      console.log(val)
      if(val!=undefined){
        this.handleConditions(val)
      }
      console.log(this.sql)
      var obj = {
        conditions: this.sql,
        page: this.page.currentPage,
        size: this.page.pageSize,
      }
      fetchList('/query/khySingleModel', 'post', null, obj).then(res=>{
        if(res.result) { 
          this.tableData = res.data
          this.page.pageTotal = res.map.total
        }
      })
    },
    buttonClick(name) {
      this[name]();
    },
    table() {
      console.log("table");
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
    deleted() {
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
        type: 'warning'
      }).then(() => {
        let params = {
          type: this.type,
          id: this.tableList.join(',')
        }
        fetchList('index/delete', 'get', params).then(res=>{
        if(res.result) { 
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
