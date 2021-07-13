<template>
  <div class="userManage">
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
        :data="tableData"
        border
        style="width:100%"
        :row-style="{ height: '40px' }"
        :cell-style="{ padding: '0' }"
        height="600"
        :header-cell-style="{ color: '#333', padding: '5px 0' }"
      >
        <el-table-column
          v-for="item in tableColumn"
          :key="item.title"
          :prop="item.prop"
          :label="item.label"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column  label="操作" width="200" align="center">
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
              icon="el-icon-document-delete"
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
        :page-sizes="[20, 50, 100,200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.pageTotal"
      >
      </el-pagination>
    </div>
       <!-- 弹框 -->
    <div class="dialog">
      <user-manage-dialog
        ref="userManageDialog"
        :visible.sync="dialog.visible"
        :title.sync="dialog.title"
        @updateTable="setSearch"
        :typeConfig ="typeConfig"
      />
    </div>
  </div>
</template>
<script>
import { apiRequest } from "@/api/pagesApi/openBilling.js";
import userManageDialog from "@/views/pages/components/userManage/dialog.vue";
export default {
  name: "userManage",
  components: {
    userManageDialog
  },
  data() {
    return {
      search: {},
      typeConfig:{},
      tableBtn: [
        { icon: "plus", event: "addUser", title: "添加用户名", type: "primary" },
      ],
      tableColumn: [
        { label: "用户名", prop: "username" },
        { label: "昵称", prop: "nickname" },
        { label: "创建日期", prop: "createtime" },
        { label: "状态", prop: "available" },
        { label: "一指通路径", prop: "yztUrl" },
        { label: "一指通用户名", prop: "yztUsername" },
        { label: "一指通密码", prop: "yztPassword" },
        { label: "客户", prop: "organizationName" },
      ],
      tableData: [],
      tableList: [],
      page: {
        pageSize: 20,
        pageTotal: 0,
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
    addUser() {
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
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          let data = {id:row.id,type:'user'}
          apiRequest('index/delete', data).then(res => {
            this.setSearch()
          })
      })
    },
    handleSizeChange(size) {
      this.page.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    setSearch(){
      apiRequest('query/users','','post',{page:this.page.currentPage,size:this.page.pageSize}).then(res=>{
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
.userManage {
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
