<template>
  <div style="width: 100%">
    <a-row :style="{ marginBottom: '24px' }">
      <a-col :span="24">
        <a-card title="密云水库">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="5">
                <img src="static/img/u171.svg" alt="" />
              </a-col>
              <a-col :span="19" :style="{ marginTop: '2em' }">
                <p>
                  密云水库，位于北京市密云区城北13公里处，位于燕山群山丘陵之中，建成于1960年9月份。面积180平方公里，环密云水库有200公里。密云水库库容40亿立方米，平均水深30米。密云水库有2大入库河流，分别是白河和潮河。密云水库是华北地区最大的水库，也是首都北京最重要地表饮用水水源地，有“燕山明珠”之称。
                  [10]
                  围绕水库还有一条110公里长的环湖公路，是北京旅游风景区之一。库区夏季平均气温低于市区3℃，是一处避暑胜地。密云水库特产野生密云水库鱼，是北京著名的鱼乡。
                </p>
                <p>
                  截止2021年9月15日，密云水库水位155.18米，蓄水量35.59亿立方米。
                </p>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row :style="{ marginBottom: '24px' }">
      <a-col :span="24">
        <a-card title="基本信息">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="24">
                <a-descriptions layout="horizontal" bordered :column="3">
                  <a-descriptions-item label="水库名称">
                    密云水库
                  </a-descriptions-item>
                  <a-descriptions-item label="水库地点">
                    北京市密云区密云县
                  </a-descriptions-item>
                  <a-descriptions-item label="所在河流">
                    白江
                  </a-descriptions-item>
                  <a-descriptions-item label="始建时间">
                    2012年1月22日
                  </a-descriptions-item>
                  <a-descriptions-item label="建成时间">
                    2013年1月22日
                  </a-descriptions-item>
                  <a-descriptions-item label="改建时间">
                    2015年12月5日
                  </a-descriptions-item>
                  <a-descriptions-item label="建设单位">
                    密云水利局
                  </a-descriptions-item>
                  <a-descriptions-item label="设计单位">
                    水利局研究院
                  </a-descriptions-item>
                  <a-descriptions-item label="施工单位">
                    中铁2344局
                  </a-descriptions-item>
                  <a-descriptions-item label="工程投资">
                    2300万
                  </a-descriptions-item>
                  <a-descriptions-item label="工程等级">
                    小（2）级
                  </a-descriptions-item>
                  <a-descriptions-item label="主要功能">
                    蓄水
                  </a-descriptions-item>
                </a-descriptions>
              </a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <a-row :style="{ marginBottom: '24px' }">
      <a-col :span="24">
        <a-card title="详情">
          <a-card-grid style="width: 100%; text-align: left">
            <a-row>
              <a-col :span="24"></a-col>
            </a-row>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: "EmptyPageView",
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  updated() {},
  methods: {},
};
</script>

<style lang="less" scoped>
p {
  white-space: normal;
  word-break: normal;
  text-indent: 2em;
}
</style>
