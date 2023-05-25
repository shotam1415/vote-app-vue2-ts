<template>
  <div>
    <v-container>
      <v-alert v-show="successMessage" type="success">{{ successMessage }}</v-alert>
      <v-alert v-show="errorMessage" type="error">{{ errorMessage }}</v-alert>
      <v-alert v-show="warningMessage" type="warning">{{ warningMessage }}<router-link to="/signup">こちらより</router-link>会員登録をお願いします。</v-alert>
      <v-container>
        <v-row justify="center">
          <v-col sm="5" cols="12" v-for="plan in plans" :key="plan.title">
            <v-hover v-slot="{ hover }">
              <v-card
                class="mx-auto"
                max-width="350"
                :class="[{ 'on-hover': hover }, { isPlanActive: selectedPlan.id === plan.id }]"
                @click="
                  selectedPlan.id = plan.id;
                  selectedPlan.title = plan.title;
                "
              >
                <v-img src="../assets/thumbnail dummy.jpg" height="200px"></v-img>
                <v-card-title>{{ plan.title }}</v-card-title>
                <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <v-container>
      <v-row>
        <v-col sm="4" cols="12" class="mx-auto">
          <v-btn v-bind:loading="isVoting" block v-bind:disabled="!selectedPlan.id || isVoting" @click="insertVote">投票する</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <p>Cardのサムネイルに使用している画像の引用先</p>
      著作者：<a
        target="_blank"
        href="https://jp.freepik.com/free-vector/flat-neon-gaming-youtube-thumbnail_33809384.htm#query=%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB&position=49&from_view=keyword&track=sph"
        >Freepik</a
      >
    </v-container>
  </div>
</template>
<style lang="scss" scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
  cursor: pointer;
}
.v-card:not(.on-hover) {
  opacity: 0.6;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}

.isPlanActive {
  opacity: 1 !important;
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { collection, getDocs, runTransaction, doc, Transaction } from "firebase/firestore";
import db from "../firebase/firestore";
import { Plan } from "../types/Plan";
import { User } from "../types/User";
import { Getter } from "vuex-class";

@Component
export default class VoteViewComponent extends Vue {
  successMessage = "";
  errorMessage = "";
  warningMessage = "";
  isVoting = false;
  selectedPlan = {
    id: "",
    title: "",
  };
  isUsersVotesCollection = false;
  plans: Plan[] = [];

  @Getter currentUser!: User | undefined;

  //「投票する」のロジック
  async insertVote() {
    //投票中の判定
    if (this.isVoting) {
      console.log("this.isVoting");
      await this.showVotedMessage("error", "投票処理中ですのでお待ちください。");
      return false;
    }
    this.isVoting = true;

    //ログイン中かどうかの判定
    if (!this.currentUser) {
      console.log("this.currentUser");
      await this.showVotedMessage("warning", "投票するには会員登録が必要です。");
      this.isVoting = false;
      return false;
    }

    // データ挿入
    if (this.isUsersVotesCollection) {
      console.log("this.isUsersVotesCollection");
      await this.showVotedMessage("error", "投票は一度しかできません。");
      this.isVoting = false;
      return false;
    }

    const user_id = this.currentUser.id;
    const user_name = this.currentUser.name;

    try {
      await runTransaction(db, async (transaction) => {
        // 両方のドキュメントをトランザクション内で追加
        this.insertUsersVote(user_id, transaction);
        this.insertPublicVote(user_name, transaction);
        await this.showVotedMessage("success", "投票が完了しました。");
        this.isUsersVotesCollection = true;
        this.isVoting = false;
      });
    } catch (error) {
      // 片方の処理がエラーだった場合
      console.error("Transaction failed: ", error);
      await this.showVotedMessage("error", "投票エラーです。");
      this.isVoting = false;
    }
  }

  //エラーメッセージの表示
  async showVotedMessage(type: string, message: string) {
    switch (type) {
      case "success":
        console.log("success");
        this.successMessage = message;
        break;
      case "warning":
        console.log("warning");
        this.warningMessage = message;
        break;
      case "error":
        console.log("error");
        this.errorMessage = message;
        break;
      default:
    }
  }

  //プランデータ取得
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

  //Usersのサブコレクションへ投票データ挿入
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

  //Votesコレクションへ投票データ挿入
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

  //投票の有無の判定
  async isUsersVotes(user_id: string) {
    const usersVotesCollectionPath = `users/${user_id}/users_votes/`;
    const usersVotesCollectionPathDoc = collection(db, usersVotesCollectionPath);
    const usersVotesSnapshot = await getDocs(usersVotesCollectionPathDoc);
    return !usersVotesSnapshot.empty;
  }

  mounted() {
    this.getPlans();
    const getIsUsersVotes = async () => {
      if (this.currentUser) {
        this.isUsersVotesCollection = await this.isUsersVotes(this.currentUser.id);
      }
    };
    getIsUsersVotes();
  }
}
</script>
