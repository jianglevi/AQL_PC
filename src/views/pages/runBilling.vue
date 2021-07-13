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
        :page-sizes="[20, 50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.pageTotal"
      >
      </el-pagination>
    </div>
    <div class="dialog">
      <order-sync
        ref="orderSync"
        :visible.sync="dialog.visible"
        :title.sync="dialog.title"
      />
    </div>
  </div>
</template>
<script>
import runBillingSearchForm from "@/views/pages/components/common/searchForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js";
import orderSync from "@/views/pages/components/runBilling/orderSync.vue";
export default {
  name: "runBilling",
  components: {
    runBillingSearchForm,
    orderSync
  },
  data() {
    return {
      searchForm: [
        {
          title: "查询日期",
          type: "daterange",
          name: "rangeDate",
        },
        {
          title: "发货方姓名",
          type: "input",
          name: "consignerName",
        },
        {
          title: "收货方姓名",
          type: "input",
          name: "consigneeName",
        },
      ],
      search: {},
      tableBtn: [
        { icon: "refresh", event: "orderSync", title: "同步", type: "primary" },
        { icon: "document-delete", event: "delete", title: "删除", type: "danger" },
      ],
      tableColumn: [
        { label: "开单时间", prop: "openTime", width: 250 },
        { label: "提货时间", prop: "deliveryTime", width: 180 },
        { label: "预计到达时间", prop: "appointArriveTime", width: 180 },
        { label: "客户单号", prop: "number", width: 180 },
        { label: "业务类型", prop: "businessType", width: 180 },
        { label: "发货方姓名", prop: "consignerName", width: 180 },
        { label: "发货方电话", prop: "consignerPhone", width: 180 },
        { label: "发货方证件号码", prop: "consignerIdNO", width: 180 },
        { label: "发货方详细地址", prop: "consignerAddress", width: 180 },
        { label: "收货方姓名", prop: "consigneeName", width: 180 },
        { label: "收货方证件号码", prop: "consigneeIdNO", width: 180 },
        { label: "收货方详细地址", prop: "consigneeAddress", width: 180 },
      ],
      tableData: [],
      tableList: [],
      page: {
        pageSize: 20,
        pageTotal: 0,
        currentPage: 1,
      },
      dialog: {
        title: "同步",
        visible: false,
      },
    };
  },
  methods: {
    setSearch(val) {
      var obj = {
        conditions: JSON.stringify(val),
        page: this.page.currentPage,
        size: this.page.pageSize,
      }
      fetchList('/order/query', 'post', null, obj).then(res=>{
        if(res.result) {
          this.tableData = res.data.list
          this.page.pageTotal = res.data.total
        }
      })
    },
    buttonClick(name) {
      this[name]();
    },
    orderSync() {
      this.dialog.visible = true
      // const obj = {
      // }
      // fetchList('/order/sync', '', null, obj).then(res=>{
      //   if(res.result) { 
      //     this.tableData = res.data.list
      //     this.page.pageTotal = res.data.total
      //   }
      // })
    },
    delete(){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteByKey(this.tableList.join(','))
      })
    },
    deleteByKey(id) {
      fetchList("/order/delete", "", { id, type: this.type }).then(res => {
        if (res.result) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.setSearch();
        }
      });
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
  },
  mounted() {
    this.setSearch()
  },
};
</script>
<style lang="scss" scoped>
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
