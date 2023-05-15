<template>
  <div class="admin" v-if="isCurrentUser?.role === 0">
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
          <div class="chartWrap" v-if="isShow" v-bind:class="{ isActive: navNum === 0 }"><ChartComponets v-if="isShow" :chartData="chartData" :options="options" /></div>
        </v-list>
        <v-list v-if="navNum === 1">
          <template>
            <div>
              <v-data-table :headers="headers" :items="users" item-key="name" class="elevation-1" :search="search" :custom-filter="filterOnlyCapsText">
                <template v-slot:top>
                  <v-btn color="primary" dark class="mb-2 ml-4 mt-4"> New Item </v-btn>
                  <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                </template>
                <template v-slot:body.append>
                  <tr>
                    <td></td>
                    <td>
                      <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                    </td>
                    <td colspan="4"></td>
                  </tr>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                  <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </div>
          </template>
        </v-list>
      </v-container>
    </v-layout>
  </div>
</template>
<style lang="scss">
.head {
  text-align: center;
}

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
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ChartComponets from "@/components/ChartComponets.vue";
import { User } from "../types/User";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import db from "../firebase/firestore";

type plans = {
  title: string;
  count: number;
};

@Component({
  components: {
    ChartComponets,
  },
})
export default class AdminViewComponent extends Vue {
  // 変数
  navItems = [
    { title: "votetotal", icon: "mdi-notification-clear-all" },
    { title: "users", icon: "mdi-account-group" },
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
  search = "";
  calories = "";
  users = this.getUsers;

  options = {
    responsive: true,
    maintainAspectRatio: false,
  };
  editItem(item) {
    console.log(item);
  }

  deleteItem(item) {
    console.log(item);
  }

  async getPlans() {
    const plansRef = query(collection(db, "plans"), orderBy("title", "asc"));
    const plansSnapshot = await getDocs(plansRef);
    const plans = plansSnapshot.docs.map((doc) => {
      const data = doc.data();
      const planTitle = { title: data.title, count: 0 };
      console.log(planTitle);
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

  filterOnlyCapsText(value, search, item) {
    return value != null && search != null && typeof value === "string" && value.toString().toLocaleUpperCase().indexOf(search) !== -1;
  }

  get isCurrentUser(): User | undefined {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }

  get getUsers(): User[] | undefined {
    return this.$store.getters.users;
  }
  get headers(): any {
    return [
      {
        text: "id",
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "名前",
        value: "name",
      },
      { text: "メールアドレス", value: "email" },
      { text: "役割", value: "role" },
      { text: "作成日", value: "created_at" },
      { text: "編集日", value: "updated_at" },
      { text: "投票の有無", value: "votes" },
      { text: "操作", value: "actions" },
    ];
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
    console.log(this.users);
    // ユーザーの権限判定
    getAuth().onAuthStateChanged(() => {
      if (!this.isCurrentUser || this.isCurrentUser.role !== 0) {
        this.$router.push("/vote");
      }
    });
    // データ取得
    this.getVotedChartData();
  }
}
</script>
