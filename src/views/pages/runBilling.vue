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
  </div>
</template>
<script>
import runBillingSearchForm from "@/views/pages/components/common/searchForm.vue";
export default {
  name: "runBilling",
  components: { runBillingSearchForm },
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
          name: "payerName",
        },
        {
          title: "收货方姓名",
          type: "input",
          name: "payeeName",
        },
      ],
      search: {},
      tableBtn: [
        { icon: "refresh", event: "refresh", title: "同步", type: "primary" },
        { icon: "document", event: "table", title: "表格", type: "primary" },
      ],
      tableColumn: [
        { label: "开单时间", prop: "openDate", width: 250 },
        { label: "提货时间", prop: "receiveDate", width: 180 },
        { label: "预计到达时间", prop: "arriveDate", width: 180 },
        { label: "客户单号", prop: "number", width: 180 },
        { label: "业务类型", prop: "businessType", width: 180 },
        { label: "发货方姓名", prop: "payerName", width: 180 },
        { label: "发货方电话", prop: "payerPhone", width: 180 },
        { label: "发货方证件号码", prop: "payerNum", width: 180 },
        { label: "地区", prop: "area", width: 180 },
        { label: "详细地址", prop: "detailAddress", width: 180 },
        { label: "收货方姓名", prop: "payeeName", width: 180 },
        { label: "收货方证件号码", prop: "payeeNum", width: 180 },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],
      tableList: [],
      page: {
        pageSize: 10,
        pageTotal: 50,
        currentPage: 1,
      },
    };
  },
  methods: {
    setSearch(val) {
      this.search = val;
      console.log(this.search);
    },
    buttonClick(name) {
      this[name]();
    },
    refresh() {
      console.log("refresh");
    },
    table() {
      console.log("table");
    },
    handleSizeChange(size) {
      console.log(size);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
    },
    selectTableList(list) {
      this.tableList = list;
    },
  },
  mounted() {},
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
