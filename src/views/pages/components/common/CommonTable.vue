<template>
    <div class="table">
     <el-table
       class="table_content"
       :data="tableData"
       size="mini"
       border
       @select="selectTableList"
       @select-all="selectTableList"
       :row-style="{ height: '40px' }"
       :cell-style="{ padding: 0 }"
       height="600"
       style="width: 100%"
      >
      <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          sortable
          :key="item.title"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column  label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleDetail(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-collection"
              plain
              >查看</el-button
            >
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
        :page-sizes="[20, 50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.pageTotal"
      >
      </el-pagination> 
    </div>
</template>
 
<script>
export default {
  props: {
    tableData: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    typeConfig:{
      type:Object
    }
  },
  methods:{

  }
}
</script>

<style>

</style>