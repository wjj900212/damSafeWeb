<template>
  <div style="width: 100%; height: 100%">
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12" :style="{ height: '100%' }">
        <a-card title="安全概况">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="16">
                <h2>密云水库</h2>
                <a-row>
                  <a-col :span="4">所在地址</a-col>
                  <a-col :span="20">北京市密云区恒河西山</a-col>
                </a-row>
                <a-row>
                  <a-col :span="4">管理单位</a-col>
                  <a-col :span="20">密云水库管理所</a-col>
                </a-row>
              </a-col>
              <a-col :span="8">
                <img src="static/img/u268.svg" alt="" />
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center">
            <a-row>
              <a-col :span="12">
                <a-row>
                  <a-col>综合安全等级</a-col>
                </a-row>
                <a-row>
                  <a-col>正常</a-col>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <a-col :span="24">预警数</a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">13</a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: center">
            <a-row>
              <a-col :span="12">
                <img src="static/img/u289.png" alt="" />
              </a-col>
              <a-col :span="12" :style="{ marginTop: '25px' }">
                <a-row>
                  <a-col :span="12">雨情监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">水情监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">渗流监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">渗压监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">变形监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">微动监测</a-col>
                  <a-col :span="12">正常</a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ height: '100%' }">
        <a-card title="水库可视化">
          <a-select
            slot="extra"
            v-model="scene"
            placeholder="选择场景"
            option-filter-prop="children"
            @change="handleSceneChange"
          >
            <a-select-option v-for="item in sceneData" :value="item.id" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-card-grid style="width: 100%; text-align: center">
            <img width="100%" src="static/img/u483.png" alt="" />
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="安全管理预案">
          <a-select
            slot="extra"
            v-model="plan"
            placeholder="预案类型"
            option-filter-prop="children"
            @change="handlePlanChange"
          >
            <a-select-option v-for="item in planData" :value="item.id" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-card-grid style="width: 100%; text-align: center">
            <a-table
              bordered
              :data-source="dataSource"
              :columns="aqglyacolumns"
            >
              <template slot="name" slot-scope="text, record">
                <editable-cell
                  :text="text"
                  @change="onCellChange(record.key, 'name', $event)"
                />
              </template>
              <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="Sure to delete?"
                  @confirm="() => onDelete(record.key)"
                >
                  <a href="javascript:;">Delete</a>
                </a-popconfirm>
              </template>
            </a-table>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="综合趋势统计">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <a-card title="雨情监测">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="水情监测">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="24">
        <a-card title="微动监测数据统计">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="8">
        <a-card title="渗流监测">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="渗压监测">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="变形监测">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row
      :gutter="{ xs: 8, sm: 16, md: 24 }"
      :style="{ marginBottom: '24px' }"
    >
      <a-col :span="12">
        <a-card title="预警消息">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="运维记录">
          <a slot="extra" href="#">more</a>
          <a-card-grid style="width: 100%; text-align: center"></a-card-grid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'generalview',
  components: {},
  data () {
    return {
      aqglyadataSource: [],
      scene: 1,
      sceneData: [
        {id: 1, name: '场景1'},
        {id: 2, name: '场景2'},
        {id: 3, name: '场景3'}
      ],
      plan: 0,
      planData: [
        {id: 0, name: '全部预案'},
        {id: 1, name: '预案1'},
        {id: 2, name: '预案2'},
        {id: 3, name: '预案3'}
      ]
    }
  },
  computed: {
    aqglyacolumns () {
      return [
        {
          title: '序号',
          width: '5%',
          align: 'center',
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: '预案名称',
          dataIndex: 'DateTime',
          align: 'center',
          width: '15%'
        },
        {
          title: '预案类型',
          dataIndex: 'Amount',
          align: 'center',
          width: '10%'
        },
        {
          title: '创建人',
          dataIndex: 'XMBH',
          align: 'center',
          width: '10%'
        },
        {
          title: '描述',
          dataIndex: 'HTBH',
          align: 'center',
          width: '50%'
        },
        {
          title: '操作',
          width: '100px',
          align: 'center',
          customRender: (record) => (
            <div>
              <a
                onClick={() => {
                  // this.AddInstance(record)
                }}
              >
                查看
              </a>
            </div>
          )
        }
      ]
    }
  },
  mounted () {},
  updated () {},
  methods: {
    handleSceneChange () {},
    handlePlanChange () {}
  }
}
</script>

<style lang="less" scoped>
</style>
