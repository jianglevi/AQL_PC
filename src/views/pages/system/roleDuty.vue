<template>
  <div class="roleDuty">
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
        :data="tableData"
        border
        style="width:60%"
        :row-style="{ height: '20px' }"
        :cell-style="{ padding: '5px 0' }"
        height="600"
        :header-cell-style="{ color: '#333', padding: '5px 0' }"
      >
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column
          v-for="item in tableColumn"
          :key="item.title"
          :prop="item.prop"
          :label="item.label"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column  label="操作" width="300" align="center"> 
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
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              plain
              @click="handleAccess(scope.row, scope.$index)"
              >权限</el-button
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
        :page-sizes="[ 20, 50, 100 ,200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.pageTotal"
      >
      </el-pagination>
    </div>
   <!-- 弹框 -->
    <div class="dialog">
      <role-duty-dialog
        ref="roleDutyDialog"
        :visible.sync="dialog.visible"
        :title.sync="dialog.title"
        @updateTable="setSearch"
        :typeConfig ="typeConfig"
      />
    </div>
    <div>
      <access-dialog  
        :visible.sync="accessDialog.visible"
        :title.sync="accessDialog.title"
        :typeConfig="typeConfig"
      />
    </div>
  </div>
</template>
<script>
import { apiRequest } from "@/api/pagesApi/openBilling.js";
import roleDutyDialog from "@/views/pages/components/roleDuty/dialog.vue";
import accessDialog from "@/views/pages/components/roleDuty/accessDialog.vue";
export default {
  name: "runBilling",
  components: {
    roleDutyDialog,
    accessDialog,
  },
  data() {
    return {
      dialog: {
        title: "新增",
        visible: false,
      },
      accessDialog:{
        title: "权限",
        visible: false
      },
      typeConfig:{},
      search: {},
      tableBtn: [
        { icon: "plus", event: "addRole", title: "添加角色", type: "primary" },
      ],
      tableColumn: [
        { label: "角色名", prop: "name" },
        { label: "描述", prop: "description" },
        { label: "状态", prop: "available"},
      ],
      tableData: [
      ],
      tableList: [],
      page: {
        pageSize: 20,
        pageTotal: 50,
        currentPage: 1,
      },
      dialog: {
        title: "新增",
        visible: false,
      },
    };
  },
  methods: {
    buttonClick(name) {
      this[name]();
    },
    addRole(){
      this.typeConfig = {id:""}
      this.dialog.visible = true
      this.dialog.title = "新增"
    },
    handleEdit(row){
      this.dialog.visible = true
      this.dialog.title = "编辑"
      this.typeConfig = row
    },
    handleDelete(row){
      let data = {id:row.id,type:'role'}
      apiRequest('index/delete', data).then(res => {
        this.setSearch()
      })
    },
    handleAccess(row){
      this.accessDialog.visible = true
      this.typeConfig = row
    },
    handleSizeChange(size) {
      this.page.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    setSearch(){
      apiRequest('query/sysRole',{page:this.page.currentPage,msg:{},size:this.page.pageSize}).then(res=>{
        this.tableData = res.data
        this.page.pageTotal = res.map.total
      })
    }
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
.roleDuty {
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
  width: 60%;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
