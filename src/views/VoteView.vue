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
            isChosePlan.id = plan.id;
            isChosePlan.title = plan.title;
          "
        >
          <div :class="{ isPlanActive: isChosePlan.id === plan.id }" class="isPlan">
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
      <v-btn v-bind:loading="isVoting" block v-bind:disabled="!isChosePlan.id || isVoting" @click="postVote">投票する</v-btn>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { collection, getDocs, runTransaction, doc } from 'firebase/firestore'
import db from '../firebase/firestore'
import { Plan } from '../types/Plan'
import { User } from '../types/User'

@Component({})
export default class VoteViewComponent extends Vue {
  successMessage = ''
  errorMessage = ''
  warningMessage = ''
  isVoting = false
  isChosePlan = {
    id: '',
    title: ''
  }

  mounted () {
    console.log(this.getPlans())
  }

  justifycontent = {
    center: 'center'
  }

  plans: Plan[] = []
  async getPlans () {
    const citiesRef = collection(db, 'plans')
    const querySnapshot = await getDocs(citiesRef)
    this.plans = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const plan: Plan = {
        id: doc.id,
        title: data.title,
        description: data.description,
        created_at: data.created_at,
        updated_at: data.update_at
      }
      return plan
    })
  }

  async postVote () {
    if (this.isVoting) {
      return false
    }
    this.isVoting = true
    if (!this.isCurrentUser) {
      this.warningMessage = '投票するには会員登録が必要です。'
      this.isVoting = false
      return false
    }

    const user_id = this.isCurrentUser.id
    const user_name = this.isCurrentUser.name
    const public_vote_id_object = {
      plans_title: this.isChosePlan.title,
      users_name: user_name,
      created_at: new Date(),
      updated_at: new Date()
    }

    const user_vote_id_object = {
      plans_title: this.isChosePlan.title,
      created_at: new Date(),
      updated_at: new Date()
    }
    const usersVotesCollectionPath = `users/${user_id}/users_votes/`
    const usersVotesCollectionPathDoc = collection(db, usersVotesCollectionPath)
    const votesPath = collection(db, 'public_votes')
    const usersVotesSnapshot = await getDocs(usersVotesCollectionPathDoc)
    const isUsersVotesCollection = usersVotesSnapshot.empty

    // データ挿入
    if (!isUsersVotesCollection) {
      this.errorMessage = '既に投票すみです。'
      this.isVoting = false
      return false
    }
    try {
      await runTransaction(db, async (transaction) => {
        const usersVotesRef = doc(usersVotesCollectionPathDoc, this.isChosePlan.id)
        const votesRef = doc(votesPath, this.isChosePlan.id)

        // 両方のドキュメントをトランザクション内で追加
        transaction.set(usersVotesRef, user_vote_id_object)
        transaction.set(votesRef, public_vote_id_object)
        console.log('Transaction successful')
        this.successMessage = '投票が完了しました。'
        this.isVoting = false
      })
    } catch (error) {
      // 片方の処理がエラーだった場合
      console.error('Transaction failed: ', error)
      this.isVoting = false
    }
  }

  get isCurrentUser (): User | undefined {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser
    }
  }
}
</script>
