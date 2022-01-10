<template>
  <!-- 水情概况 -->
  <div class="overview">
    <div class="tit">
      <span>水情概况</span>
      <a-button> 安全管理预案
        <a-icon type="read" style="fontSize:1.6rem" />
      </a-button>
    </div>
    <div class="basicMsg">
      <div class="basicTxt">
        <a-icon type="area-chart" style="fontSize:3rem;color:#1397db" />
        <div class="basic">
          <div class="subtit">水情监测</div>
          <div class="subTxt"><span>测站编码</span> test_001</div>
          <div class="subTxt"><span>建设时间</span> 2022-01-01</div>
          <div class="subTxt"><span>联系人</span> 张三</div>
        </div>
      </div>
      <img src="static/img/u268.svg" alt="" />
    </div>
    <div class="stateMsg">
      <div class="s_left">
        <div>
          <div>库水位</div>
          <div style="font-size:1.8rem;color:#1a94ff;">5.0m</div>
        </div>
        <img src="static/img/u467.png" style="width:5rem;margin-left:1rem;">
        <!-- <div class="bili">
          <div class="bilivimg"></div>
          <div class="bliliv">50%</div>
        </div> -->

      </div>
      <div class="s_right">
        <div>安全状态</div>
        <div style="font-size:1.8rem;color:#24C174;">正常</div>
      </div>
    </div>
    <div class="dataBox">
      <div class="data_tit">
        <div>
          <span>当前</span>
          <a-select v-model="current">
            <a-select-option value="jack">Jack (100)</a-select-option>
            <a-select-option value="lucy">Lucy (101)</a-select-option>
          </a-select>
        </div>
        <div>
          <a-button type="primary" size="small">召测</a-button>
          <a-button type="primary" size="small">加密采集</a-button>
        </div>
      </div>
      <div class="dataVBox">
          <div class="dataV" v-for="i in 4" :key="i">
              <div>
                  <span>当前库水位(m)</span>
                  <span class="cricle"></span>
              </div>
              <div>
                  <span>5.0</span>
                  <span>2009-07-20 23:12</span>
              </div>
          </div>
          <div style="width:22.5%;"></div>
          <div style="width:22.5%;"></div>
          <div class="seemore">更多<a-icon type="double-right" /></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["pointId"],
    data() {
      return {
        current: 'jack'
      };
    },
    watch: {
      pointId: {
        handler: function (n, o) {
          console.log(n)
        },
        immediate: true
      }
    },
    methods: {},
  }

</script>
<style scoped>
  .overview {
    /* padding: 1rem; */
    background-color: #fff;
    position: relative;
  }

  .tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
  }
  .tit>span{
    font-size: 1.6rem;
  }

  .basicMsg {
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding: 1rem 0;
  }

  .basicTxt {
    display: flex;
  }

  .basic {
    margin-left: 5px;
  }

  .subtit {
    font-weight: 500;
    font-size: 1.6rem;
  }

  .subTxt {
    font-size: 1.4rem;
  }

  .subTxt span {
    display: inline-block;
    width: 8rem;
  }

  .stateMsg {
    display: flex;
    align-items: center;
    /* justify-content: space-around; */
    padding: 1rem 0;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.6rem;
  }

  .s_left,
  .s_right {
    flex: 1;
    text-align: center;
  }

  .s_left {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #f2f2f2;
  }

  .bili {
    width: 4.5rem;
    height: 4.5rem;
    background-color: skyblue;
    border-radius: 50%;
    margin-left: 5px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .bilivimg {
    width: 3.8rem;
    height: 3.8rem;
    border-radius: 50%;
    background-color: pink;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 50%;
  }

  .bliliv {
    color: #8b8d90;
    text-align: center;
    text-shadow: #000;
    position: relative;
    z-index: 1;
  }

  .dataBox {
    padding: 1rem 0;
  }

  .data_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
.dataVBox{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 1rem;
}
.dataV{
    width: 22.5%;
    padding: 8px;
    box-shadow: 2px 2px 15px rgb(76 89 248 / 16%);
    margin-bottom: 1rem;
    cursor: default;
}
.dataV div{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.seemore{
    margin-left: auto;
    cursor: pointer;
}
</style>
