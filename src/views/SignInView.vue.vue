<template>
  <div class="signin" v-if="!isCurrentUser">
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">ログイン</h1>
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
          />
          <v-card-actions>
            <v-btn @click="signin">ログイン</v-btn>
            <router-link to="/signup" class=""><v-btn color="blue lighten-2" text> 会員登録はこちら </v-btn></router-link>
          </v-card-actions>
        </v-form>
        <v-alert type="error" v-show="errorMessage">{{ errorMessage }}</v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { convertErrorCode } from "../lib/convertErrorCode";

@Component
export default class SigninView extends Vue {
  showPassword: boolean = false;
  email: string = "";
  password: string = "";
  errorMessage: string | undefined = "";

  async signin() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        this.$router.push("/vote");
      })
      .catch((error) => {
        const errorCode = error.code;
        this.errorMessage = convertErrorCode(errorCode);
        console.log(errorCode);
      });
  }
  get isCurrentUser(): any {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }

  async mounted() {
    //ユーザーの権限判定
    getAuth().onAuthStateChanged(() => {
      if (!this.isCurrentUser) {
        return false;
      }
      if (this.isCurrentUser) {
        this.$router.push("/vote");
      }
    });
  }
}
</script>
