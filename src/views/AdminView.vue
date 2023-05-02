<template>
  <div class="admin" v-if="isCurrentUser?.role === 0">
    <v-card-title>
      <h1 class="display-1">管理画面</h1>
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
        <div class="chartWrap" v-if="isShow" v-bind:class="{ isActive: navNum === 0 }"><Chart v-if="isShow" :chartData="chartData" :options="options" /></div>
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
import ChartComponents from "@/components/ChartComponents.vue";
import { User } from "../types/User";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, runTransaction, doc, query, orderBy } from "firebase/firestore";
import db from "../firebase/firestore";

@Component({
  components: {
    ChartComponents,
  },
})
export default class AdminViewComponent extends Vue {
  // 変数

  navItems = [{ title: "overview", icon: "mdi-notification-clear-all" }];

  navNum = 0;

  isShow = false;

  planList: any = [{}];
  chartLabel: any = [];
  chartTotal: any = [];

  chartData = {
    labels: this.chartLabel,
    datasets: [
      {
        label: "投票数",
        data: this.chartTotal,
        backgroundColor: "lightblue",
      },
    ],
  };

  options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  async getPublicVotes() {
    // dbからプランを取得
    const plansRef = query(collection(db, "plans"), orderBy("title", "asc"));
    const planQuerySnapshot = await getDocs(plansRef);
    this.planList = planQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      const planTitle = { title: data.title, count: 0 };
      console.log(planTitle);
      return planTitle;
    });

    // chartLabelに代入
    for (let i = 0; i < this.planList.length; i++) {
      this.chartLabel[i] = this.planList[i].title;
    }

    // dbから投票データ取得
    const publicVotesRef = collection(db, "public_votes");
    const querySnapshot = await getDocs(publicVotesRef);
    const planTitleTotal = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const planTitleTotal = data.plans_title;
      return planTitleTotal;
    });

    // planデータを整形
    planTitleTotal.map((item, index) => {
      for (let i = 0; i < this.planList.length; i++) {
        if (item === this.planList[i].title) {
          this.planList[i].count += 1;
        }
      }
    });

    // chartTotalに挿入
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

  @Watch("isCurrentUser")
  onChangeLoadingStatus() {
    if (!this.isCurrentUser) {
      return false;
    }
    if (this.isCurrentUser.role !== 0) {
      this.$router.push("/vote");
    }
  }

  async mounted() {
    // ユーザーの権限判定
    getAuth().onAuthStateChanged(() => {
      if (!this.isCurrentUser || this.isCurrentUser.role !== 0) {
        this.$router.push("/vote");
      }
    });
    // データ取得
    this.getPublicVotes();
    // 子コンポーネントのメソッドを実行する
  }
}
</script>
