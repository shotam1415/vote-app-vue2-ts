<template>
  <v-container class="pt-16" v-if="!currentUser">
    <v-card maxWidth="600px" class="mx-auto px-4 py-4">
      <v-card-title>
        <h2 class="display-h2">ログイン</h2>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="mdi-account-circle" type="email" label="メールアドレス" v-model="email" />
          <v-text-field
            @click:append="showPassword = !showPassword"
            v-bind:append-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            v-bind:type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            label="パスワード"
            v-model="password"
            class="mb-4"
          />
          <v-card-actions>
            <v-btn v-bind:loading="currentUser" v-bind:disabled="isLoading" @click="signIn">ログイン</v-btn>
            <router-link to="/signup" class="ml-4"><v-btn color="blue lighten-2" text>会員登録はこちら </v-btn></router-link>
          </v-card-actions>
        </v-form>
        <v-alert type="error" v-show="errorMessage">{{ errorMessage }}</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { convertErrorCode } from "../lib/convertErrorCode";
import { User } from "../types/User";
import { Getter } from "vuex-class";

@Component
export default class SignInView extends Vue {
  showPassword = false;
  email = "";
  password = "";
  errorMessage: string | undefined = "";
  isLoading = false;

  async signIn() {
    this.isLoading = true;
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, this.email, this.password);
      this.$router.push("/vote");
      this.isLoading = false;
    } catch (error: any) {
      const errorCode = error.code;
      this.errorMessage = convertErrorCode(errorCode);
      console.log(errorCode);
      this.isLoading = false;
    }
  }

  @Getter currentUser!: User | undefined;
  async mounted() {
    // ログイン済なら投票画面へ遷移させる
    getAuth().onAuthStateChanged(() => {
      if (!this.currentUser) {
        return false;
      }
      if (this.currentUser) {
        this.$router.push("/vote");
      }
    });
  }
}
</script>
