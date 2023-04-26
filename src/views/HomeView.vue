<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" class="logo" />
    <div>
      <p class="head">投票ページへようこそ</p>
      <router-link to="/vote" class="voteBtn">投票する</router-link>
      <div class="authBtns">
        <router-link to="/signup" class="">会員登録</router-link>
        <router-link to="/signin" class="">ログイン</router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.head {
  text-align: center;
}

.logo {
  display: block;
  margin: 0 auto;
}

.voteBtn {
  display: block;
  max-width: 300px;
  margin: 0 auto;
  text-decoration: none;
  border: solid 1px blue;
  color: blue;
  padding: 4px 8px;
  border-radius: 8px;
  text-align: center;
  transition-duration: 0.3s;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 24px;
  &:hover {
    background-color: blue;
    color: #fff;
  }
}

.authBtns {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  > a {
    text-decoration: none;
    color: #000;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>
