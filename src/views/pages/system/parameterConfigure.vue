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
        :row-style="{ height: '40px' }"
        :cell-style="{ padding: '0' }"
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
        :page-sizes="[20, 50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.pageTotal"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import runBillingSearchForm from "@/views/pages/components/common/searchForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js";

export default {
  name: "parameterConfigure",
  components: {
    runBillingSearchForm
  },
  data() {
    return {
      type: 'parameterConfigure',
      searchForm: [
        {
          title: "参数类型",
          type: "input",
          name: "name",
        },
        {
          title: "参数名称",
          type: "input",
          name: "conKe",
        },
      ],
      search: {},
      tableBtn: [
        { icon: "document-delete", event: "deleted", title: "删除", type: "danger" },
      ],
      tableColumn: [
        { label: "参数类型", prop: "name" },
        { label: "参数名称", prop: "conKey" },
        { label: "参数值", prop: "convalues" },
        { label: "备注", prop: "remark" },
        { label: "开始时间", prop: "SYYMMDD" },
        { label: "结束时间", prop: "SYYMMDD" },
        { label: "状态", prop: "state" },
      ],
      tableData: [],
      tableList: [],
      page: {
        pageSize: 20,
        pageTotal: 0,
        currentPage: 1,
      },
      sql: '',
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
      fetchList('/query/parameterConfigure', 'post', null, obj).then(res=>{
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
