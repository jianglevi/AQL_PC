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
        class="table_content"
        :data="tableData"
        border
        @select="selectTableList"
        @select-all="selectTableList"
        :row-style="{ height: '20px' }"
        :cell-style="{ padding: '5px 0' }"
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
        :page-sizes="[10, 20, 50, 100]"
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
      />
    </div>
  </div>
</template>
<script>
import runBillingSearchForm from "@/views/pages/components/common/searchForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js";

export default {
  name: "runBilling",
  components: {
    runBillingSearchForm
  },
  data() {
    return {
      type: 'intervalTime',
      searchForm: [
        {
          title: "起始地址",
          type: "input",
          name: "startAddress",
        },
        {
          title: "结束地址",
          type: "input",
          name: "endAddress",
        },
      ],
      search: {},
      tableBtn: [
        { icon: "document-delete", event: "deleted", title: "删除", type: "danger" },
      ],
      tableColumn: [
        { label: "ID", prop: "id", width: 60 },
        { label: "起始地址", prop: "startAddress", width: 300 },
        { label: "结束地址", prop: "endAddress", width: 300 },
        { label: "预计到达时长", prop: "appointArriveDuration", width: 130 },
        { label: "备注1", prop: "spare1", width: 120 },
        { label: "备注2", prop: "spare2", width: 120 },
        { label: "备注3", prop: "spare3", width: 120 },
      ],
      tableData: [],
      tableList: [],
      page: {
        pageSize: 10,
        pageTotal: 50,
        currentPage: 1,
      },
      sql: '',
      importDialog: {
        title: '预计到达时长导入',
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
      fetchList('/query/aqlIntervalTime', 'post', null, obj).then(res=>{
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
      this.tableList = list;
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
        alert('请选择要删除的记录')
        return
      }
      let ids = ''
      for (let i = 0, len = this.tableList.length; i < len; i++) {
        ids += ids ? ',' + this.tableList[i]['id'] : this.tableList[i]['id']
      }
      let params = {
        type: this.type,
        id: ids
      }
      fetchList('index/delete', 'get', params).then(res=>{
        if(res.result) { 
          this.search()
        }
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
