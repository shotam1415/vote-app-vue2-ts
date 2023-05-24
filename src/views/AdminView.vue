<template>
  <div class="admin" v-if="currentUser?.role === 0">
    <v-card-title>
      <h1 class="display-1">管理画面</h1>
    </v-card-title>
    <v-layout justify-space-between align-start>
      <v-card height="400" width="256">
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
      <v-container height="800" width="100%">
        <v-list v-if="navNum === 0">
          <div class="chartWrap" v-if="isShow" v-bind:class="{ isActive: navNum === 0 }"><ChartComponent v-if="isShow" :chartData="chartData" :options="options" /></div>
        </v-list>
        <v-list v-if="navNum === 1">
          <AdminContents />
        </v-list>
      </v-container>
    </v-layout>
  </div>
</template>
<style lang="scss">
.chartWrap {
  width: 800px;
  height: 800px;
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
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ChartComponent from "@/components/ChartComponent.vue";
import AdminContents from "../components/admin/AdminContents.vue";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import db from "../firebase/firestore";
import { Getter } from "vuex-class";

type plans = {
  title: string;
  count: number;
};

@Component({
  components: {
    ChartComponent,
    AdminContents,
  },
})
export default class AdminViewComponent extends Vue {
  // 変数
  navItems = [
    { title: "voteTotal", icon: "mdi-notification-clear-all" },
    { title: "contents", icon: "mdi-aspect-ratio" },
  ];

  navNum = 0;
  isShow = false;
  plans: plans[] = [];
  chartLabel: string[] = [];
  chartTotal: number[] = [];

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

  @Getter currentUser!: any;

  async getPlans() {
    const plansRef = query(collection(db, "plans"), orderBy("title", "asc"));
    const plansSnapshot = await getDocs(plansRef);
    const plans = plansSnapshot.docs.map((doc) => {
      const data = doc.data();
      const planTitle = { title: data.title, count: 0 };
      return planTitle;
    });
    return plans;
  }

  async getPublicVotedTitleList() {
    const publicVotesRef = collection(db, "public_votes");
    const publicVotesSnapshot = await getDocs(publicVotesRef);
    const publicVotedTitleList = publicVotesSnapshot.docs.map((doc) => {
      const data = doc.data();
      const votedPlanTitle = data.plans_title;
      return votedPlanTitle;
    });
    publicVotedTitleList.map((item) => {
      for (let i = 0; i < this.plans.length; i++) {
        if (item === this.plans[i].title) {
          this.plans[i].count += 1;
        }
      }
    });
  }

  async getVotedChartData() {
    // dbからプランを取得
    this.plans = await this.getPlans();

    // chartLabelに代入
    for (let i = 0; i < this.plans.length; i++) {
      this.chartLabel[i] = this.plans[i].title;
    }

    // dbから投票データ取得し、planを整形
    await this.getPublicVotedTitleList();

    // chartTotalに挿入
    for (let i = 0; i < this.plans.length; i++) {
      this.chartTotal[i] = this.plans[i].count;
    }
    this.isShow = true;
  }

  changeNav(num: number) {
    this.navNum = num;
    console.log(this.navNum);
  }

  onChangeLoadingStatus() {
    if (!this.currentUser) {
      return false;
    }
    if (this.currentUser.role !== 0) {
      this.$router.push("/signin");
    }
  }

  async mounted() {
    // ユーザーの権限判定
    getAuth().onAuthStateChanged(() => {
      if (!this.currentUser || this.currentUser.role !== 0) {
        this.$router.push("/signin");
      }
    });
    // データ取得
    this.getVotedChartData();
  }
}
</script>
