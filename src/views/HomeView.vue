<template>
  <v-container class="pt-16">
    <v-card max-width="400px" class="mx-auto py-10 px-10">
      <v-row justify="center" class="mb-16">
        <h2 class="display-h2">投票ページへようこそ</h2>
      </v-row>
      <router-link to="/vote" block class="mb-10 d-block"><v-btn color="primary" elevation="2" block class="d-block">投票する</v-btn></router-link>
      <v-card-actions v-if="!currentUser">
        <router-link to="/signup" class="d-block mx-auto"><v-btn color="blue" text>会員登録</v-btn></router-link>
        <router-link to="/signin" class="d-block mx-auto"><v-btn color="blue" text>ログイン</v-btn></router-link>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "../types/User";
import { Getter } from "vuex-class";

@Component
export default class HomeView extends Vue {
  @Getter currentUser!: User | undefined;
}
</script>
