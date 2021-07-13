<template>
  <div>
    <el-col :span="config.span" v-if="config.type == 'input'">
      <label class="f-ac-end">
        {{ config.title }}：<el-input 
          v-model="setvalue"
          :placeholder="'请输入' + config.title"
          size="mini"
          clearable
          :style="{width:config.width ? config.width : '220px'}"
          @input="input"
          @blur="blur"
          :show-password="config.password"
          :disabled="disable"
        ></el-input>
      </label>
    </el-col>
    <el-col :span="config.span" v-else-if="config.type == 'datetimes'">
      <label class="f-ac-end">
        {{ config.title }}：
        <el-date-picker
           clearable
          @change="select"
          v-model="setvalue"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
          size="mini"
          :disabled="disable"
        />
      </label>
    </el-col>
    <el-col :span="config.span" v-else-if="config.type == 'picker_same'">
      <label class="f-ac-end">
        {{ config.title }}：
        <el-select
          clearable
          :multiple="config.multiple"
          v-model="setvalue"
          placeholder="请选择"
          size="mini"
          @change="select"
          :disabled="disable"
        >
          <el-option
            v-for="item in config.range"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </label>
    </el-col>
    <el-col :span="config.span" v-else-if="config.type == 'region'">
      <label class="f-ac-end">
        {{ config.title }}：
        <el-cascader
          clearable
          :disabled="disable"
          style="width: 220px;"
          size="mini"
          :options="regionData"
          v-model="setvalue"
          :props="{value:'label'}"
          @change="selectArea"
        >
        </el-cascader>
      </label>
    </el-col>
    <el-col :span="0" v-else-if="config.type == 'hide'"></el-col>
  </div>
</template>
 
<script>
import { regionData } from "element-china-area-data";
export default {
  props: {
    config: {
      type: Object,
      default: {},
    },
    value:{
    },
    disable:{
      type:Boolean,
      default: false,
    }
  },
  computed:{
    setvalue:{
      get(){
        return this.value;
      },
      set(val){
        console.log(val)
        this.$emit("update:value", val);
      }
    },
  },
  data() {
    return {
      regionData: regionData,
     
    };
  },
  methods: {
    input(val) {
      let event = this.config.event ? this.config.event : "input";
      this.$emit(event, this.config, val);
    },
    blur(val) {
      let event = this.config.event ? this.config.event : "blur";
      this.$emit(event, this.config, val);
    },
    select(val) {
      let event = this.config.event ? this.config.event : "select";
      this.$emit(event, this.config, val);
    },
    selectArea(val) {
      let event = this.config.event ? this.config.event : "selectArea";
      this.$emit(event, this.config, val);
    },
  },

  created() {
    // console.log(this.regionData);
  },
};
</script>

<style lang="scss" scoped>

</style>