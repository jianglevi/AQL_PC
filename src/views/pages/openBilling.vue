<template>
  <div class="openBilling">
    <!-- 查询 -->
    <div class="search_container">
      <open-billing-search-form  :config.sync="searchForm" @setSearchForm="setSearch"/>
    </div>
    <!-- 表格 -->
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
        <el-table-column  label="操作" width="180" align="center" fixed="right"> 
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row)"
              size="mini"
              type="success"
              icon="el-icon-edit"
              plain
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              plain
              @click="handleDelete(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
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
    <!-- 弹框 -->
    <div class="dialog">
      <open-billing-dialog
        ref="billingDialog"
        :visible.sync="dialog.visible"
        :title.sync="dialog.title"
      />
    </div>
    <!-- 导入 -->
    <div class="dialog">
      <excelImport
        ref="importDialog"
        :visible.sync="importDialog.visible"
        :title.sync="importDialog.title"
      />
    </div>
  </div>
</template>
<script>
import openBillingDialog from "@/views/pages/components/openBilling/dialog.vue";
import openBillingSearchForm from "@/views/pages/components/common/searchForm.vue";
import excelImport from "@/views/pages/components/common/ExcelImport.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js";
export default {
  name: "openBilling",
  components: { 
    openBillingDialog,
    openBillingSearchForm,
    excelImport
  },
  data() {
    return {
      searchForm:[
        {
          title:'客户单号',
          type:'input',
          name:'num',
          level:'search'
        },
        {
           title:'查询日期',
           type:'daterange',
           name:'rangeDate',
           level:'search'
        }
      ],
      saveData: {
        baseInfo: {
          openDate: "",
        },
      },
      tableBtn: [
        { icon: "plus", event: "addItem", title: "新增", type: "primary" },
        { icon: "thumb", event: "signOff", title: "签收", type: "primary" },
        {
          icon: "document-delete",
          event: "rex",
          title: "撤销",
          type: "warning",
        },
        {
          icon: "delete",
          event: "deteleTable",
          title: "批量删除",
          type: "danger",
        },
        {
          icon: "s-data",
          event: "excelImportData",
          title: "Excel导入",
          type: "primary",
        },
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
      search: {},
      page: {
        pageSize: 20,
        pageTotal: 1000,
        currentPage: 1,
      },
      data: [],
      dialog: {
        title: "新增",
        visible: false,
      },
      importDialog: {
        title: 'Excel导入',
        visible: false
      }
    };
  },
  methods: {
    buttonClick(name) {
      this[name]();
    },
    setSearch(val){
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
    deteleTable() {
      console.log("delete table");
    },
    addItem() {
      this.dialog.visible = true
    },
    selectTableList(list) {
      this.tableList = list;
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.setSearch()
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
      this.setSearch()
    },
    handleEdit(e) {
      this.$refs['billingDialog'].updateOrder(e)
      this.dialog.visible = true
    },
    handleDelete(e, index) {
      console.log(e, index);
      this.deleteByKey(e.id)
    },
    signOff(){
      console.log('签收')
      // fetchList('/order/signOff', '', {number: '', signer: ''}).then(res=>{
      //   console.log(res)
      // })
    },
    deleteByKey(id){
      // 来个提示框
      // fetchList('/order/delete', '', e.id).then(res=>{
      //   console.log(res)
      // })
    },
    excelImportData(){
      this.importDialog.visible = true
    },
  },
  mounted() {
    this.setSearch()
    // fetchList('/order/customer', '', {msg:'其他'}).then(res=>{
    //   console.log(res)
    // })
  },
};
</script>
<style lang="scss" scoped>
.dialog label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.el-dialog__header {
  padding: 0px;
  padding-bottom: 10px;
}
.openBilling {
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
  height:auto !important;
}
.table_Pagination {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
