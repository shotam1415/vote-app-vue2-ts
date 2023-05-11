<template>
  <div class="vote">
    <v-container>
      <v-alert v-show="successMessage" type="success">{{ successMessage }}</v-alert>
      <v-alert v-show="errorMessage" type="error">{{ errorMessage }}</v-alert>
      <v-alert v-show="warningMessage" type="warning">{{ warningMessage }}<router-link to="/signup">こちらより</router-link>会員登録をお願いします。</v-alert>
      <v-row :justify="justifycontent.center">
        <v-col
          cols="5"
          v-for="plan in plans"
          :key="plan.title"
          @click="
            selectedPlan.id = plan.id;
            selectedPlan.title = plan.title;
          "
        >
          <div :class="{ isPlanActive: selectedPlan.id === plan.id }" class="isPlan">
            <v-card class="mx-auto" max-width="344">
              <v-img src="../assets/thumbnail dummy.jpg" height="200px"></v-img>
              <v-card-title>{{ plan.title }}</v-card-title>
              <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="btnWrap">
      <v-btn v-bind:loading="isVoting" block v-bind:disabled="!selectedPlan.id || isVoting" @click="insertVote">投票する</v-btn>
    </div>
    <div class="note">
      <p>Cardのサムネイルに使用している画像の引用先</p>
      著作者：<a
        target="_blank"
        href="https://jp.freepik.com/free-vector/flat-neon-gaming-youtube-thumbnail_33809384.htm#query=%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB&position=49&from_view=keyword&track=sph"
        >Freepik</a
      >
    </div>
  </div>
</template>

<style lang="scss">
.btnWrap {
  max-width: 400px;
  margin: 0 auto;
}

.note {
  text-align: center;
}
.isPlan {
  margin: 0 auto;
  max-width: 344px;
  border-radius: 4px;
  border: solid 2px white;
}

.isPlanActive {
  border: solid 2px red;
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { collection, getDocs, runTransaction, doc, Transaction } from "firebase/firestore";
import db from "../firebase/firestore";
import { Plan } from "../types/Plan";
import { User } from "../types/User";

@Component
export default class VoteViewComponent extends Vue {
  //変数
  successMessage = "";
  errorMessage = "";
  warningMessage = "";
  isVoting = false;
  selectedPlan = {
    id: "",
    title: "",
  };
  justifycontent = {
    center: "center",
  };
  isUsersVotesCollection = false;
  plans: Plan[] = [];

  async getPlans() {
    const planRef = collection(db, "plans");
    const planQuerySnapshot = await getDocs(planRef);
    this.plans = planQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      const plan: Plan = {
        id: doc.id,
        title: data.title,
        description: data.description,
        created_at: data.created_at,
        updated_at: data.update_at,
      };
      return plan;
    });
  }

  async insertUsersVote(user_id: string, transaction: Transaction) {
    const usersVotesCollectionPath = `users/${user_id}/users_votes/`;
    const usersVotesCollectionPathDoc = collection(db, usersVotesCollectionPath);
    const usersVotesRef = doc(usersVotesCollectionPathDoc, this.selectedPlan.id);
    transaction.set(usersVotesRef, {
      plans_title: this.selectedPlan.title,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  async insertPublicVote(user_name: string, transaction: Transaction) {
    const votesPath = collection(db, "public_votes");
    const votesRef = doc(votesPath, this.selectedPlan.id);
    transaction.set(votesRef, {
      plans_title: this.selectedPlan.title,
      users_name: user_name,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  async isUsersVotes(user_id: string) {
    const usersVotesCollectionPath = `users/${user_id}/users_votes/`;
    const usersVotesCollectionPathDoc = collection(db, usersVotesCollectionPath);
    const usersVotesSnapshot = await getDocs(usersVotesCollectionPathDoc);
    return !usersVotesSnapshot.empty;
  }

  async insertVote() {
    if (this.isVoting) {
      return false;
    }
    this.isVoting = true;

    if (!this.isCurrentUser) {
      this.warningMessage = "投票するには会員登録が必要です。";
      this.isVoting = false;
      return false;
    }

    // データ挿入
    if (this.isUsersVotesCollection) {
      this.errorMessage = "既に投票すみです。";
      this.isVoting = false;
      return false;
    }

    const user_id = this.isCurrentUser.id;
    const user_name = this.isCurrentUser.name;

    try {
      await runTransaction(db, async (transaction) => {
        // 両方のドキュメントをトランザクション内で追加
        this.insertUsersVote(user_id, transaction);
        this.insertPublicVote(user_name, transaction);
        console.log("Transaction successful");
        this.successMessage = "投票が完了しました。";
        this.isUsersVotesCollection = true;
        this.isVoting = false;
      });
    } catch (error) {
      // 片方の処理がエラーだった場合
      console.error("Transaction failed: ", error);
      this.isVoting = false;
    }
  }
  get isCurrentUser(): User | undefined {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }
  mounted() {
    this.getPlans();
    const getIsUsersVotes = async () => {
      if (this.isCurrentUser) {
        this.isUsersVotesCollection = await this.isUsersVotes(this.isCurrentUser.id);
      }
    };
    getIsUsersVotes();
  }
}
</script>
