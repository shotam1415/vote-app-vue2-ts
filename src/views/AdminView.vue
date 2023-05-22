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
          <AdminContentsView />
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
import AdminContentsView from "./AdminContentsView.vue";
import { User } from "../types/User";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import db from "../firebase/firestore";

type plans = {
  title: string;
  count: number;
};

@Component({
  components: {
    ChartComponets,
    AdminContentsView,
  },
})
export default class AdminViewComponent extends Vue {
  // 変数
  navItems = [
    { title: "votetotal", icon: "mdi-notification-clear-all" },
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
  search = "";
  calories = "";
  users: User[] | undefined = [];

  isNewItemDialog = false;
  isEditItemDialog = false;

  options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  dialogCurrentData = {
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  };

  dialogNewItemData = {
    name: "",
    email: "",
    role: "",
  };

  dialogEditItemData = {
    name: "",
    email: "",
    password: "",
    role: "",
  };

  NewItem() {
    this.isNewItemDialog = true;
  }

  editItem(item: any) {
    console.log(item);
    //データクリア
    this.dialogEditItemData.name = "";
    this.dialogEditItemData.email = "";
    this.dialogEditItemData.password = "";
    this.dialogEditItemData.role = "";

    this.dialogCurrentData.id = item.id;
    this.dialogCurrentData.name = item.name;
    this.dialogCurrentData.email = item.email;
    this.dialogCurrentData.password = item.password;
    this.dialogCurrentData.role = item.role;
    this.isEditItemDialog = true;
  }

  async saveEditItem() {
    const docRef = doc(db, "users", this.dialogCurrentData.id);
    const name = this.dialogEditItemData.name ? this.dialogEditItemData.name : this.dialogCurrentData.name;
    const email = this.dialogEditItemData.email ? this.dialogEditItemData.email : this.dialogCurrentData.email;
    const password = this.dialogEditItemData.password ? this.dialogEditItemData.password : this.dialogCurrentData.password;
    const role = this.dialogEditItemData.role ? this.dialogEditItemData.role : this.dialogCurrentData.role;

    const updatedItem = {
      name: name,
      email: email,
      password: password,
      role: role,
      updated_at: serverTimestamp(),
    };

    try {
      await updateDoc(docRef, updatedItem);
      this.setUsers();
    } catch (error) {
      console.log(error);
    }
    this.isEditItemDialog = false;
  }

  deleteItem(item: any) {
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

  filterOnlyCapsText(value: any, search: any) {
    return value != null && search != null && typeof value === "string" && value.toString().toLocaleUpperCase().indexOf(search) !== -1;
  }
  // filterOnlyCapsText(value:any, search:any, item) {
  //   return value != null && search != null && typeof value === "string" && value.toString().toLocaleUpperCase().indexOf(search) !== -1;
  // }
  async isUsersVotes(user_id: string) {
    const usersVotesCollectionPath = `users/${user_id}/users_votes/`;
    const usersVotesCollectionPathDoc = collection(db, usersVotesCollectionPath);
    const usersVotesSnapshot = await getDocs(usersVotesCollectionPathDoc);
    return !usersVotesSnapshot.empty;
  }

  async setUsers() {
    const userRef = collection(db, "users");
    const userQuerySnapshot = await getDocs(userRef);
    const usersPromises = userQuerySnapshot.docs.map(async (doc) => {
      const isVotes = await this.isUsersVotes(doc.id);
      const data = doc.data();
      const user: User = {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at,
        votes: isVotes,
      };
      return user;
    });
    const users = await Promise.all(usersPromises);
    this.$store.commit("setUsers", users);
    this.users = this.getUsers;
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
      this.$router.push("/signin");
    }
  }

  async mounted() {
    // ユーザーの権限判定
    getAuth().onAuthStateChanged(() => {
      if (!this.isCurrentUser || this.isCurrentUser.role !== 0) {
        this.$router.push("/signin");
      }
    });
    // データ取得
    this.getVotedChartData();
    this.setUsers();
  }
}
</script>
