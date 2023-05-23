<template>
  <div class="home">
    <p class="head">投票ページへようこそ</p>
    <div class="wrap">
      <router-link to="/vote"><v-btn color="primary" elevation="2" block>投票する</v-btn></router-link>
      <div class="authBtns" v-if="!isCurrentUser">
        <router-link to="/signup" class=""><v-btn color="blue" text>会員登録</v-btn></router-link>
        <router-link to="/signin" class=""><v-btn color="blue" text>ログイン</v-btn></router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.head {
  text-align: center;
  font-size: 40px;
  font-weight: 700;
}

.home {
  padding: 80px 0;
}

.wrap {
  max-width: 300px;
  margin: 0 auto;
  padding-top: 40px;
}

.authBtns {
  margin-top: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "../types/User";

@Component
export default class HomeView extends Vue {
  get isCurrentUser(): User | undefined {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }
}
</script>
