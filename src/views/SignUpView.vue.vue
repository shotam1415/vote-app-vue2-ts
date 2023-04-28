<template>
  <div class="signup">
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">会員登録</h1>
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
            <v-btn @click="signup">会員登録</v-btn>
            <router-link to="/signup" class=""><v-btn color="blue lighten-2" text> ログインはこちら </v-btn></router-link>
          </v-card-actions>
        </v-form>
        <v-alert type="error" v-show="errorMessage">{{ errorMessage }}</v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { convertErrorCode } from "../lib/convertErrorCode";
@Component
export default class SigninView extends Vue {
  showPassword: boolean = false;
  email: string = "";
  password: string = "";
  errorMessage: string | undefined = "";

  async signup() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.password)
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
}
</script>
