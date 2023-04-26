<template>
  <div class="admin">
    <h1 class="head">管理画面</h1>
    <div class="layout">
      <nav class="layout__nav">
        <ul class="layout__nav_list">
          <li class="layout__nav_listItem" @click="changeNav(0)">overview</li>
          <li class="layout__nav_listItem" @click="changeNav(1)">votetotal</li>
        </ul>
      </nav>
      <div class="layout__chart">
        <div class="chartWrap" v-bind:class="{ isActive: navNum === 0 }"><Chart :chartData="chartData1" :options="options" /></div>
        <div class="chartWrap" v-bind:class="{ isActive: navNum === 1 }"><Chart :chartData="chartData2" :options="options" /></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.head {
  text-align: center;
}

.layout {
  display: flex;
  align-items: flex-start;
  .layout__nav {
    width: 15%;
    font-size: 20px;
  }
  .layout__nav_listItem {
    list-style: none;
    margin-bottom: 12px;
    cursor: pointer;
    transition-duration: 0.3s;
    &:hover {
      opacity: 0.7;
    }
  }
}
.layout__chart {
  width: 85%;
  position: relative;
  .chartWrap {
    width: 800px;
    height: 800px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    opacity: 0;
    pointer-events: none;
    transition-duration: 0.3s;
    &.isActive {
      opacity: 1;
      pointer-events: auto;
    }
    > div > canvas {
      width: 100%;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Chart from "@/components/Chart.vue";

@Component({
  components: {
    Chart,
  },
})
export default class AdminViewComponent extends Vue {
  //変数
  navNum: number = 0;
  chartData1 = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "投票数",
        data: [95, 70, 80, 65],
        backgroundColor: "lightblue",
      },
    ],
  };
  chartData2 = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "投票数",
        data: [20, 30, 40, 55],
        backgroundColor: "lightblue",
      },
    ],
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  //関数
  changeNav(num: number) {
    this.navNum = num;
    console.log(this.navNum);
  }
}
</script>
