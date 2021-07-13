<template>
  <el-form ref="searchData" :model="searchData" :inline="true" class="searchForm">
    <template v-for="item in config">
      <el-form-item
        :label="item.title + ':'"
        :prop="item.name"
        :key="item.title"
        v-if="item.type == 'input'"
      >
        <el-input v-model="searchData[item.name]" size="mini" clearable @input="onInput"></el-input>
      </el-form-item>
      <el-form-item
        :label="item.title + ':'"
        :prop="item.name"
        :key="item.title"
        v-else-if="item.type == 'daterange'"
      >
        <el-date-picker
          size="mini"
          clearable
          v-model="searchData[item.name]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('searchData')"
        size="mini"
        icon="el-icon-search"
        >查询</el-button
      >
      <el-button @click="resetForm('searchData')" size="mini" icon="el-icon-delete"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props:{
    config:{
      type: Array,
      require:true
    }
  },
  data(){
    return{
      searchData:{

      }
    }
  },
  methods:{
   onChange(){
     this.$forceUpdate();
   },
   onInput(){
     this.$forceUpdate();
   },
  
   submitForm(name) {
      this.$emit('setSearchForm',this[name])
    },
    resetForm(name) {
      this.$refs[name].resetFields();
      this.$emit('setSearchForm',this[name])
    },
  }
};
</script>

<style>
label{
  color: #666666;
  font-weight: 500;
}
.el-date-editor{
  width: 240px;
}
</style>