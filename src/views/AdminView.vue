<template>
  <div class="admin">
    <v-card-title>
      <h1 class="display-1">会員登録</h1>
    </v-card-title>
    <div class="layout">
      <nav class="layout__nav"></nav>
      <v-card height="400" width="256" class="mx-auto">
        <v-navigation-drawer permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6"> Application </v-list-item-title>
              <v-list-item-subtitle> subtext </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list dense nav>
            <v-list-item v-for="(item, index) in navItems" :key="item.title" link @click="changeNav(index)">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-card>
      <div class="layout__chart">
        <div class="chartWrap" v-if="isShow" v-bind:class="{ isActive: navNum === 0 }"><Chart v-if="isShow" :chartData="chartData1" :options="options" /></div>
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
import { User } from "../types/User";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, runTransaction, doc } from "firebase/firestore";
import db from "../firebase/firestore";

@Component({
  components: {
    Chart,
  },
})
export default class AdminViewComponent extends Vue {
  //変数

  navItems = [
    { title: "overview", icon: "mdi-notification-clear-all" },
    { title: "votetotal", icon: "mdi-vote" },
  ];

  navNum: number = 0;

  planTotalData = new Array();

  isShow: boolean = false;

  planList = [
    {
      title: "A",
      count: 0,
    },
    {
      title: "B",
      count: 0,
    },
    {
      title: "C",
      count: 0,
    },
    {
      title: "D",
      count: 0,
    },
  ];

  chartLavel = ["A", "B", "C", "D"];
  chartTotal = new Array();
  chartTotal2 = new Array();

  chartData1 = {
    labels: this.chartLavel,
    datasets: [
      {
        label: "投票数",
        data: this.chartTotal,
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

  async getPublicVotes() {
    //dbからデータ取得
    const publicVotesRef = collection(db, "public_votes");
    const querySnapshot = await getDocs(publicVotesRef);
    const planTitleTotal = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const planTitleTotal = data.plans_title;
      return planTitleTotal;
    });

    //planデータを整形
    planTitleTotal.map((item, index) => {
      for (let i = 0; i < this.planList.length; i++) {
        if (item === this.planList[i].title) {
          this.planList[i].count += 1;
        }
      }
    });

    //chartTotalに挿入
    for (let i = 0; i < this.planList.length; i++) {
      this.chartTotal[i] = this.planList[i].count;
    }
    console.log(this.chartTotal);
    this.isShow = true;
  }

  changeNav(num: number) {
    this.navNum = num;
    console.log(this.navNum);
  }
  get isCurrentUser(): User | undefined {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }
  async mounted() {
    //ユーザーの権限判定
    // getAuth().onAuthStateChanged(() => {
    //   if (!this.isCurrentUser) {
    //     return false;
    //   }
    //   if (this.isCurrentUser.role !== 0) {
    //     this.$router.push("/vote");
    //   }
    // });
    //データ取得
    this.getPublicVotes();
    // 子コンポーネントのメソッドを実行する
  }
}
</script>
