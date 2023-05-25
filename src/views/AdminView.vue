<template>
  <v-container class="pt-16" v-if="currentUser?.role === 0">
    <v-card-title>
      <h2 class="display-h2">管理画面</h2>
    </v-card-title>
    <v-layout>
      <v-row>
        <v-col cols="12" md="3">
          <NavComponent @change-nav="changeNav" />
        </v-col>
        <v-col cols="12" md="9">
          <v-container height="800" width="100%">
            <v-list v-if="navNum === 0">
              <v-card max-width="800" class="mx-auto" v-if="isShow" v-bind:class="{ isActive: navNum === 0 }"><ChartComponent v-if="isShow" :chartData="chartData" :options="options" /></v-card>
            </v-list>
            <v-list v-if="navNum === 1">
              <AdminContents />
            </v-list>
          </v-container>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ChartComponent from "@/components/ChartComponent.vue";
import AdminContents from "../components/admin/AdminContents.vue";
import NavComponent from "@/components/admin/NavComponent.vue";
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
    NavComponent,
  },
})
export default class AdminViewComponent extends Vue {
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
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
  };
  @Getter currentUser!: any;

  changeNav(num: number) {
    this.navNum = num;
  }

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
