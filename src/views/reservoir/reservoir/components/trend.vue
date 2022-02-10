<template>
  <a-card>
    <div class="safetyPlan">
      <div class="card">
        <img src="static/img/control/图层648.png"/>
        <span>综合趋势统计</span>
      </div>
      <div>
        <a-select
          style="width: 100px"
          v-model="dateModel"
          option-filter-prop="children"
          @change="handleDateModelChange"
        >
          <a-select-option
            v-for="item in dateModelData"
            :value="item.value"
            :key="item.value"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-range-picker
          v-model="dateTimeValue"
          style="width: 240px"
          @change="onDateChange"
        />
        <a-button @click="getTrendStatistics" type="primary"> 查询 </a-button>
        <a-button @click="exportEXcel" type="primary"> 导出 </a-button>
        </div>
    </div>
    <div style="width: 100%;margin-top:1rem;">
      <a-row>
        <a-col :span="6">
          <div class="select-tree">
            <a-input-search
              v-model="searchStr"
              style="margin-bottom: 8px"
              placeholder="搜索监测点"
              @change="onChange"
            />
            <a-tree
              checkable
              @check="onChecked"
              :checkedKeys="checkedKeys"
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              :replaceFields="replaceFields"
              :defaultExpandAll="defaultExpandAll"
              :treeData="treeData"
              @expand="onExpand"
            >
              <template slot="title" slot-scope="{ name }">
                <span
                  v-html="
                    name.replace(
                      new RegExp(searchValue, 'g'),
                      '<span style=color:#f50>' + searchValue + '</span>'
                    )
                  "
                ></span>
              </template>
            </a-tree>
          </div>
        </a-col>
        <a-col :span="18">
          <div :style="{ width: '100%', height: '300px' }">
            <component
              :is="'EchartsRelationship'"
              refid="Relationship"
              :data="relationshipData"
              class="main-content"
            ></component>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>
<script>
import moment from "moment";
import EchartsRelationship from "@/components/echarts/EchartsRelationship.vue";
export default {
  name: "trend",
  components: {
    EchartsRelationship,
  },
  props: {
    relationshipData: {
      type: Array,
      default: () => [],
    },
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkedKeys: [],
      expandedKeys: [],
      replaceFields: { title: "name" },
      searchValue: "",
      searchStr: "",
      autoExpandParent: true,
      defaultExpandAll: true,
      dateTimeValue: [
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ],
      dateModel: "now",
      dateModelData: [
        { name: "今日", value: "now" },
        { name: "近三天", value: "day" },
        { name: "近一周", value: "week" },
        { name: "近一月", value: "month" },
      ],
    };
  },
  computed: {},
  mounted() {},
  updated() {},
  watch: {},
  methods: {
    moment,
    getCheckedIds() {
      let ids = [];
      let pids = this.treeData.map((item) => item.key);
      let checkedKeys = this.checkedKeys;
      for (let i = 0; i < checkedKeys.length; i++) {
        if (!pids.includes(checkedKeys[i])) {
          ids.push(checkedKeys[i]);
        }
      }
      return ids;
    },
    getTrendStatistics() {
      let params = {};
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      const ids = this.getCheckedIds();
      params = {
        startTime: start,
        endTime: end,
      };
      if (ids.length > 0) {
        params.projPnIds = ids.join(",");
      }
      this.$emit("getTrendStatistics", params);
    },
    exportEXcel () {
      let params = {};
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      const ids = this.getCheckedIds();
      params = {
        startTime: start,
        endTime: end,
      };
      if (ids.length > 0) {
        params.projPnIds = ids.join(",");
      }
      this.$emit("exportEXcel", params);
    },
    handleDateModelChange(value) {
      let dateValue;
      switch (value) {
        case "now":
          dateValue = [
            moment(new Date(), "YYYY-MM-DD"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
        case "day":
          dateValue = [
            moment().subtract(3, "days"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
        case "week":
          dateValue = [
            moment().subtract(1, "weeks"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
        case "month":
          dateValue = [
            moment().subtract(1, "months"),
            moment(new Date(), "YYYY-MM-DD"),
          ];
          break;
      }
      this.dateTimeValue = dateValue;
    },
    onDateChange(dates, dateStrings) {
      console.log(this.dateTimeValue);
      const start = moment(this.dateTimeValue[0]).format("YYYY-MM-DD");
      const end = moment(this.dateTimeValue[1]).format("YYYY-MM-DD");
      console.log(start, end);
      this.dateModel = undefined;
    },

    onChecked(checkedKeys, e) {
      this.checkedKeys = checkedKeys;
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 获取节点中含有value的所有key集合
    getkeyList(value, tree, keyList) {
      // 遍历所有同一级的树
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i];
        // 如果该节点存在value值则push
        if (node.name.indexOf(value) > -1) {
          keyList.push(node.key);
        }
        // 如果拥有孩子继续遍历
        if (node.children) {
          this.getkeyList(value, node.children, keyList);
        }
      }
      // 因为是引用类型，所有每次递归操作的都是同一个数组
      return keyList;
    },
    // 该递归主要用于获取key的父亲节点的key值
    getParentKey(key, tree) {
      let parentKey, temp;
      // 遍历同级节点
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          // 如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
          // 如果不存在，继续遍历其子节点
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key;
          } else if ((temp = this.getParentKey(key, node.children))) {
            // parentKey = this.getParentKey(key,node.children)
            // 改进，避免二次遍历
            parentKey = temp;
          }
        }
      }
      return parentKey;
    },
    // 获取该节点的所有祖先节点
    getAllParentKey(key, tree) {
      var parentKey;
      if (key) {
        // 获得父亲节点
        parentKey = this.getParentKey(key, tree);
        if (parentKey) {
          // 如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (!this.backupsExpandedKeys.some((item) => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey);
          }
          // 继续向上查找祖先节点
          this.getAllParentKey(parentKey, tree);
        }
      }
    },
    getTreeDataByKey(childs = [], findKey) {
      // 根据key找到数据对象
      let finditem = null;
      for (let i = 0, len = childs.length; i < len; i++) {
        let item = childs[i];
        if (item.key !== findKey && item.children && item.children.length > 0) {
          finditem = this.getTreeDataByKey(item.children, findKey);
        }
        if (item.key == findKey) {
          finditem = item;
        }
        if (finditem != null) {
          break;
        }
      }
      return finditem;
    },
    getTreeParentChilds(childs = [], findKey) {
      // 根据key获取父级节点children数组
      let parentChilds = [];
      for (let i = 0, len = childs.length; i < len; i++) {
        let item = childs[i];
        if (item.key !== findKey && item.children && item.children.length > 0) {
          parentChilds = this.getTreeParentChilds(item.children, findKey);
        }
        if (item.key == findKey) {
          parentChilds = childs;
        }
        if (parentChilds.length > 0) {
          break;
        }
      }
      return parentChilds;
    },
    onChange() {
      var vm = this;
      // 添加这行代码是为了只点击搜索才触发
      vm.searchValue = vm.searchStr;
      // 如果搜索值为空，则不展开任何项，expandedKeys置为空
      // 如果搜索值不位空，则expandedKeys的值要为搜索值的父亲及其所有祖先
      if (vm.searchValue === "") {
        vm.expandedKeys = [];
      } else {
        // 首先将展开项与展开项副本置为空
        vm.expandedKeys = [];
        vm.backupsExpandedKeys = [];
        // 获取所有存在searchValue的节点
        let candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, []);
        // 遍历满足条件的所有节点
        candidateKeysList.map((item) => {
          // 获取每个节点的母亲节点
          var key = vm.getParentKey(item, vm.treeData);
          // 当item是最高一级，父key为undefined，将不放入到数组中
          // 如果母亲已存在于数组中，也不放入到数组中
          if (key && !vm.backupsExpandedKeys.some((item) => item === key)) {
            vm.backupsExpandedKeys.push(key);
          }
        });
        let length = this.backupsExpandedKeys.length;
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData);
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice();
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .select-tree{
    width: 28.2rem;
    height: 45rem;
    overflow-y: scroll;
    background: #FFFFFF;
    box-shadow: 0px 0px 13px 0px rgba(30, 57, 85, 0.08);
  }
</style>
