<template>
  <el-dialog
    :title="title"
    :visible.sync="setVisible"
    width="1060px"
    @closed="closeDialog"
    :close-on-click-modal="false"
  >
    <!-- 开单信息 -->
    <el-row
      v-for="(row, Index) in openBillInfomation"
      :key="Index + 'row1'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @select="formSelect"
          :disable.sync="disable"
          :value.sync="saveData.openBillInfomation[item.name]"
        ></form-item>
      </div>
    </el-row>
    <!-- 发货人 -->
    <el-row
      v-for="(row, Index) in consigner"
      :key="Index + 'row2'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @blur="formBlur"
          @select="formSelect"
          @selectArea="formSelectArea"
          @consignPicker="consignPicker"
          :disable.sync="disable"
          :value.sync="saveData.consigner[item.name]"
          ></form-item>
      </div>
    </el-row>
    <!-- 收货人 -->
    <el-row
      v-for="(row, Index) in consignee"
      :key="Index + 'row3'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @blur="formBlur"
          @select="formSelect"
          @selectArea="formSelectArea"
          @consignPicker="consignPicker"
          :disable.sync="disable"
          :value.sync="saveData.consignee[item.name]"
        ></form-item>
      </div>
    </el-row>
    <!-- 货物信息 -->
    <div class="title">
      <div>货物信息</div>
      <div class="operation" v-if="!disable">
        <div @click="addTableRow" class="tag">+添加</div>
        <div @click="deleteTableRow" class="tag">-删除</div>
      </div>
      <div class="line" style="width: 60px"></div>
    </div>
    <el-table :data="cargoList" border class="cargo_list">
      <template v-for="item in cargo">
        <el-table-column
          :key="item.title"
          v-if="item.type == 'input'"
          :prop="item.name"
          :label="item.title"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              clearable
              :disabled="disable"
              v-model="scope.row[item.name]"
              @input="tableInput(scope, item)"
              :placeholder="'请输入' + item.title"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.title"
          v-else-if="item.type == 'picker_same'"
          :prop="item.name"
          :label="item.title"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-select
              :placeholder="'请选择' + item.title"
              size="mini"
              clearable
              :disabled="disable"
              v-model="scope.row[item.name]"
              @change="tableSelect(scope, item)"
            >
              <el-option
                v-for="row in item.range"
                :key="row.value"
                :label="row.label"
                :value="row.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 运费 -->
    <div class="title">
      运费
      <div class="line" style="width: 30px"></div>
    </div>
    <el-row
      v-for="(row, Index) in freightIn"
      :key="Index + '5'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @select="formSelect"
          :disable.sync="disable"
          :value.sync="saveData.freightIn[item.name]"
        ></form-item>
      </div>
    </el-row>
    <!-- 承运信息 -->
    <div class="title">
      承运信息
      <div class="line" style="width: 60px"></div>
    </div>
    <el-row
      v-for="(row, Index) in carrier"
      :key="Index + 'row5'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @select="formSelect"
          :disable.sync="disable"
          :value.sync="saveData.carrier[item.name]"
        ></form-item>
      </div>
    </el-row>
    <!-- 承运收款信息 -->
    <div class="title">
      承运收款信息
      <div class="line" style="width: 90px"></div>
    </div>
    <el-row
      v-for="(row, Index) in payee"
      :key="Index + 'row6'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @select="formSelect"
          :disable.sync="disable"
          :value.sync="saveData.payee[item.name]"
        ></form-item>
      </div>
    </el-row>
    <!-- 其他 -->
    <div class="title">
      其他
      <div class="line" style="width: 30px"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog" size="mini">确 定</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </span>
    <el-row
      v-for="(row, Index) in others"
      :key="Index + 'row7'"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title">
        <form-item
          v-bind:config="item"
          @input="formInput"
          @select="formSelect"
          :disable.sync="disable"
          :value.sync="saveData.others[item.name]"
        ></form-item>
      </div>
    </el-row>
  </el-dialog>
</template>
<script>
const cargoType = [
  { label: "煤炭及制品", value: "煤炭及制品" },
  { label: "石油、天然气及制品", value: "石油、天然气及制品" },
  { label: "金属矿石", value: "金属矿石" },
  { label: "钢铁", value: "钢铁" },
  { label: "矿建材料", value: "矿建材料" },
  { label: "水泥", value: "水泥" },
  { label: "木材", value: "木材" },
  { label: "非金属矿石", value: "非金属矿石" },
  { label: "化肥及农药", value: "化肥及农药" },
  { label: "盐", value: "盐" },
  { label: "粮食", value: "粮食" },
  { label: "机械、设备、电器", value: "机械、设备、电器" },
  { label: "轻工原料及制品", value: "轻工原料及制品" },
  { label: "有色金属", value: "有色金属" },
  { label: "轻工医药产品", value: "轻工医药产品" },
  { label: "鲜活农产品", value: "鲜活农产品" },
  { label: "冷藏冷冻货物", value: "冷藏冷冻货物" },
  { label: "商品汽车", value: "商品汽车" },
  { label: "其他", value: "其他" },
];
const business = [
  { label: "干线普货运输", value: "干线普货运输" },
  { label: "城市配送", value: "城市配送" },
  { label: "农村配送", value: "农村配送" },
  { label: "集装箱运输", value: "集装箱运输" },
  { label: "其他", value: "其他" },
];
const cargo = [
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "name",
    title: "货物名称",
  },
  {
    event: "cargo_picker_same",
    level: "cargoList",
    type: "picker_same",
    name: "type",
    title: "货物类型",
    range: cargoType,
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "weight",
    title: "装货重量(吨)",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "volume",
    title: "装货体积(方)",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "quantity",
    title: "装货件数",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "unloadWeight",
    title: "卸货重量(吨)",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "unloadVolume",
    title: "卸货体积(方)",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "unloadQuantity",
    title: "卸货件数",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "value",
    title: "货值(元)",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "remarks",
    title: "货物备注",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "note1",
    title: "浇筑部位/倒土方式",
  },
  {
    event: "cargo_input",
    level: "cargoList",
    type: "input",
    name: "note2",
    title: "渣土类型",
  },
];
const initCargo = {
  name: "",
  type: "",
  weight: "",
  volume: "",
  quantity: "",
  unloadWeight: "",
  unloadVolume: "",
  value: "",
  remarks: "",
  note1: "",
  note2: "",
};
const payType = [
  { label: "现付", value: 1 },
  { label: "到付", value: 2 },
  { label: "回付", value: 3 },
  { label: "周结", value: 4 },
  { label: "月结", value: 5 },
  { label: "货款扣", value: 6 },
  { label: "季度结", value: 7 },
  { label: "在线支付", value: 8 },
  { label: "到付月结", value: 9 },
];
const deliveryType = [
  { label: "自提", value: 1 },
  { label: "送货", value: 2 },
];
import formItem from "../common/dialogForm.vue";
import { fetchList } from "@/api/pagesApi/openBilling.js";
export default {
  props: {
    visible: {
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
  watch:{
    visible:{
      handler(newVal){
        if(newVal){
          
          if(this.title == '详情')this.disable = true
          else{this.disable = false}

          if(this.typeConfig.id){
            this.getCargoList(this.typeConfig.id);
            ['openBillInfomation','consigner','consignee','carrier','freightIn','payee','others'].forEach(name=>{
              this.formatData(name)
            })
            this.saveData.consigner.district = [this.typeConfig.consignerProvince,this.typeConfig.consignerCity,this.typeConfig.consignerDistrict]
            this.saveData.consignee.district = [this.typeConfig.consigneeProvince,this.typeConfig.consigneeCity,this.typeConfig.consigneeDistrict]
          }else{
            this.saveData = {
                openBillInfomation: {},
                consigner: {},
                consignee: {},
                carrier: {},
                freightIn: {},
                payee: {},
                others: {},
            }
            this.saveData.openBillInfomation.openTime = new Date()
            this.cargoList =  [{ ...initCargo }]
          }
        }
      },
      immediate:true
    }
  },
  computed: {
    setVisible: {
      get() {
        //回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
        return this.visible;
      },
      set(val) {
        //监视当前属性值的变化，当属性值发生变化时执行，更新相关的属性数据
        //val就是fullName3的最新属性值
        this.$emit("update:visible", val);
      },
    },
  },
  components: { formItem },
  data() {
    return {
      disable:false,
      cargo: cargo,
      cargoList: [{ ...initCargo }],
      saveData: {
          openBillInfomation: {},
          consigner: {},
          consignee: {},
          carrier: {},
          freightIn: {},
          payee: {},
          others: {},
      },
      // 收货人
      consignee: [
        [
          {
            level: "consignee",
            type: "picker_same",
            name: "consigneeName",
            title: "收货方姓名",
            event: "consignPicker",
            span: 8,
          },
          {
            level: "consignee",
            type: "input",
            name: "consigneePhone",
            title: "电话",
            span: 8,
          },
          {
            level: "consignee",
            type: "input",
            name: "consigneeIdNO",
            title: "证件号码",
            span: 8,
          },
        ],
        [
          {
            level: "consignee",
            type: "region",
            title: "省-市-区",
            name: "district",
            value: [],
            span: 8,
          },
          {
            level: "consignee",
            type: "view",
            name: "consigneeProvince",
            title: "省",
            hide: true,
          },
          {
            level: "consignee",
            type: "view",
            name: "consigneeCity",
            title: "市",
            hide: true,
          },
          {
            level: "consignee",
            type: "view",
            name: "consigneeDistrict",
            title: "地区",
            hide: true,
          },
          {
            level: "consignee",
            type: "input",
            name: "consigneeAddress",
            title: "详细地址",
            width: "560px",
            span: 16,
          },
        ],
      ],
      // 发货人
      consigner: [
        [
          {
            level: "consigner",
            type: "picker_same",
            name: "consignerName",
            title: "发货方姓名",
            event: "consignPicker",
            span: 8,
          },
          {
            level: "consigner",
            type: "input",
            name: "consignerPhone",
            title: "电话",
            span: 8,
          },
          {
            level: "consigner",
            type: "input",
            name: "consignerIdNO",
            title: "证件号码",
            span: 8,
          },
        ],
        [
          {
            level: "consigner",
            type: "region",
            title: "省-市-区",
            value: [],
            name: "district",
            disabled: true,
            span: 8,
          },
          {
            level: "consigner",
            type: "view",
            name: "consignerProvince",
            title: "省",
            type: "hide",
          },
          {
            level: "consigner",
            type: "view",
            name: "consignerCity",
            title: "市",
            type: "hide",
          },
          {
            level: "consigner",
            type: "view",
            name: "consignerDistrict",
            title: "地区",
            type: "hide",
          },
          {
            level: "consigner",
            type: "input",
            name: "consignerAddress",
            title: "详细地址",
            width: "560px",
            span: 16,
          },
        ],
      ],
      // 运费
      freightIn: [
        [
          {
            level: "freightIn",
            type: "input",
            name: "serviceFee",
            title: "服务费",
            span: 8,
          },
          {
            level: "freightIn",
            type: "input",
            name: "freightInAmount",
            title: "运费",
            span: 8,
          },
          {
            level: "freightIn",
            type: "picker_same",
            name: "freightInPayType",
            title: "支付方式",
            range: payType,
            span: 8,
          },
        ],
        [
          {
            level: "freightIn",
            type: "input",
            name: "settlementName",
            title: "结算方名称",
            span: 8,
          },
          {
            level: "freightIn",
            type: "input",
            name: "settlementPhone",
            title: "结算方电话",
            span: 8,
          },
        ],
      ],
      // 开单信息
      openBillInfomation: [
        [
          {
            level: "openBillInfomation",
            type: "datetimes",
            name: "openTime",
            title: "开单时间",
            span: 8,
          },
          {
            level: "openBillInfomation",
            type: "datetimes",
            name: "deliveryTime",
            title: "提货时间",
            span: 8,
          },
          {
            level: "openBillInfomation",
            type: "datetimes",
            name: "appointArriveTime",
            title: "预计送达时间",
            span: 8,
          },
        ],
        [
          {
            level: "openBillInfomation",
            type: "input",
            name: "originalOrderNumber",
            title: "客户单号",
            span: 8,
          },
          {
            level: "openBillInfomation",
            type: "picker_same",
            name: "businessType",
            title: "业务类型",
            range: business,
            span: 8,
          },
          {
            level: "openBillInfomation",
            type: "input",
            name: "project",
            title: "项目",
            span: 8,
          },
        ],
      ],
      // 承运信息
      carrier: [
        [
          {
            level: "carrier",
            type: "input",
            name: "carNumber",
            title: "车牌号码",
            span: 8,
          },
          {
            level: "carrier",
            type: "picker_same",
            name: "driverName",
            title: "司机姓名",
            range: [],
            // event: "driverPicker",
            span: 8,
          },
          {
            level: "carrier",
            type: "input",
            name: "driverPhone",
            title: "司机电话",
            span: 8,
          },
        ],
        [
          {
            level: "carrier",
            type: "input",
            name: "driverFreight",
            title: "司机运费",
            span: 8,
          },
          {
            level: "carrier",
            type: "input",
            name: "carrierName",
            title: "承运人",
            span: 8,
          },
          {
            level: "carrier",
            type: "input",
            name: "carrierPhone",
            title: "承运人电话",
            span: 8,
          },
        ],
        [
          {
            level: "carrier",
            type: "input",
            name: "driverFeePayeeIdCard",
            title: "证件号码",
            span: 8,
          },
        ],
      ],
      // 承运收款信息
      payee: [
        [
          {
            level: "payee",
            type: "input",
            name: "driverFeePayeeBankName",
            title: "开户银行",
            span: 8,
          },
          {
            level: "payee",
            type: "input",
            name: "driverFeePayeeBankCardNumber",
            title: "银行卡号",
            span: 8,
          },
          {
            level: "payee",
            type: "input",
            name: "driverFeePayeeName",
            title: "银行开户名",
            span: 8,
          },
        ],
      ],
      // 其他
      others: [
        [
          {
            level: "others",
            type: "input",
            name: "paymentCollect",
            title: "代收货款",
            span: 8,
          },
          {
            level: "others",
            type: "input",
            name: "receiptCount",
            title: "回单数",
            span: 8,
          },
          {
            level: "others",
            type: "input",
            name: "salesman",
            title: "业务员",
            span: 8,
          },
        ],
        [
          {
            level: "others",
            type: "input",
            name: "salesmanPhone",
            title: "业务员电话",
            span: 8,
          },
          {
            level: "others",
            type: "picker_same",
            name: "deliveryType",
            title: "提送类型",
            range: deliveryType,
            span: 8,
          },
          {
            level: "others",
            type: "input",
            name: "remarks",
            title: "备注",
            span: 8,
          },
        ],
        // {level:'others',type:'input',name:'number',title:'单号',hide:true}
      ],
    };
  },
  methods: {
    formatData(name){
      this.saveData[name]= this[name].reduce((pre,row)=>{
        row.forEach(item=> {
          pre[item.name] = this.typeConfig[item.name]
        })
        return pre
      },{})
    },
    tableInput(val, scope) {
      console.log(this.cargoList);
    },
    tableSelect(val, scope) {
      console.log(this.cargoList);
    },
    addTableRow() {
      this.cargoList.push({ ...initCargo });
    },
    deleteTableRow() {
      if (this.cargoList.length == 0) return;
      this.cargoList.pop();
    },
    closeDialog() {
      this.setVisible = false;
    },
    submitDialog() {
      let [consignerProvince,consignerCity,consignerDistrict] = [...this.saveData.consigner.district]
      let [consigneeProvince,consigneeCity,consigneeDistrict] = [...this.saveData.consignee.district]
      console.log(this.saveData.consignee.district)
      console.log(consigneeProvince,consigneeCity,consigneeDistrict)
      var obj = {
        order: {...this.saveData.openBillInfomation,
        ...this.saveData.consigner, ...this.saveData.consignee, ...this.saveData.carrier, ...this.saveData.freightIn, ...this.saveData.payee, ...this.saveData.others,consignerProvince,consignerCity,consignerDistrict,consigneeProvince,consigneeCity,consigneeDistrict},
        cargoes: this.cargoList
      }
      let url ='order/create'
      if(this.typeConfig.id){
        url = 'order/update'
        obj.order.id = this.typeConfig.id
        obj.order.number = this.typeConfig.number
      }
      fetchList(url, 'post', '', obj).then(res => {
        if(res.result) {
          this.$message("运单创建成功")
          this.closeDialog()
        }else {
          // 报错提示 res.msg
        }
      })
    },
    formBlur(config) {
       if(config.name == 'consignerAddress' || config.name == 'consigneeAddress'){
         this.setPredictTime()
       }
    },
    formInput(config, val) {
      this.saveData[config.level][config.name] = val;
    },
    formSelect(config, val) {
      this.saveData[config.level][config.name] = val;
    },
    formSelectArea(config, val) {
      this.saveData[config.level][config.name] = val;
    },
    consignPicker(config,val){
      this.saveData[config.level][config.name] = val;
      fetchList('order/customer', 'get', {msg:val}).then(val=>{
        if(val.result){
          if(config.name == 'consignerName'){
            let area = val.data[0].provinceCity.match(/.+?(省|市|自治区|自治州|盟|县|区|旗|管委会)/g)
            this.saveData[config.level].consignerPhone = val.data[0].phoneNumber
            this.saveData[config.level].consignerIdNO = val.data[0].identityNumber
            this.saveData[config.level].consignerAddress = val.data[0].address
            this.saveData[config.level].district = [area[0],area[1],area[2]]
            this.saveData[config.level].consignerProvince = area[0]
            this.saveData[config.level].consignerCity = area[1]
            this.saveData[config.level].consignerDistrict = area[2]
          }else if(config.name == 'consigneeName'){
            let area = val.data[0].provinceCity.match(/.+?(省|市|自治区|自治州|盟|县|区|旗|管委会)/g)
            this.saveData[config.level].consigneePhone = val.data[0].phoneNumber
            this.saveData[config.level].consigneeIdNO = val.data[0].identityNumber
            this.saveData[config.level].consigneeAddress = val.data[0].address
            this.saveData[config.level].district = [area[0],area[1],area[2]]
            this.saveData[config.level].consigneeProvince = area[0]
            this.saveData[config.level].consigneeCity = area[1]
            this.saveData[config.level].consigneeDistrict = area[2]
          }
          this.setPredictTime()
        }
      })
    },
    optionSet(){
      var options = {
        ee: {value: 'name', label: 'name', table: 'erp_customer'},
        er: {value: 'name', label: 'name', table: 'erp_customer'},
        driver: {value: 'driverName', label: 'driverName', table: 'erp_driver'}
      }
      fetchList('order/options', 'get', options.ee).then(res => {
        if(res.result) {
          this.consignee[0][0].range = res.data
        }
        console.log(this.consignee[0][0])
      })
      fetchList('order/options', 'get', options.er).then(res => {
        if(res.result) {
          this.consigner[0][0].range = res.data
        }
      })
      fetchList('order/options', 'get', options.driver).then(res => {
        if(res.result) {
          this.carrier[0][1].range = res.data
        }
      })
    },
    getCargoList(id){
      fetchList('order/queryCargoes', 'get', {orderId:id}).then(val=>{
        if(val.result){
          this.cargoList = val.data
        }
      })
    },
    async setPredictTime(){
        if(this.saveData.consigner?.consignerAddress && this.saveData.consignee?.consigneeAddress){
          const predictTime = await fetchList("orc/arriveDuration",'get',{startAddress:this.saveData.consigner.consignerAddress,endAddress:this.saveData.consignee.consigneeAddress})
          if(predictTime?.data){
            let time = new Date(this.saveData.openBillInfomation.openTime).getTime() + predictTime.data*60*1000
            this.saveData.openBillInfomation.appointArriveTime = new Date(time)
          }
       }
    },
  },
  mounted(){
    console.log(this.saveData)
  },
  created() {
    this.optionSet()
  },
};
</script>
<style scoped lang="scss">
.cargo_list {
  margin-top: 10px;
  margin-left: 20px;
  width: 99%;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #1890ff;
  font-size: 14px;
  height: 35px;
  width: 99%;
  line-height: 35px;
  margin-left: 20px;
  position: relative;
  .tag {
    margin-left: 20px;
    border: 1px solid #1890ff;
    color: #1890ff;
    width: 55px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }
  .operation {
    color: #1890ff;
    display: flex;
    align-items: center;
  }
}
.title::after {
  height: 2px;
  content: "";
  background: #f2f2f2;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.title .line {
  z-index: 10;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  height: 2px;
}
</style>