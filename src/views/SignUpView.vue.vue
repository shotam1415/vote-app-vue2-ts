<template>
  <div class="signup" v-if="!isSignin">
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">会員登録</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="mdi-account-circle" type="text" label="ニックネーム" v-model="name" />
          <v-text-field prepend-icon="mdi-email-outline" type="email" label="メールアドレス" v-model="email" />
          <v-text-field
            @click:append="showPassword = !showPassword"
            v-bind:append-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            v-bind:type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            label="パスワード"
            v-model="password"
          />
          <v-card-actions>
            <v-btn v-bind:loading="isLoading" v-bind:disabled="isLoading" @click="signup">会員登録</v-btn>
            <router-link to="/signin" class=""><v-btn color="blue lighten-2" text> ログインはこちら </v-btn></router-link>
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
import { setDoc, doc } from "firebase/firestore";
import db from "../firebase/firestore";
import { convertErrorCode } from "../lib/convertErrorCode";
import { User } from "@/types/User";
@Component
export default class SigninView extends Vue {
  showPassword = false;
  name = "";
  email = "";
  password = "";
  errorMessage: string | undefined = "";
  isLoading = false;

  async signup() {
    this.isLoading = true;
    // Todo ボタン２度押しされないようにする
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
      const userIdObject = {
        name: this.name,
        email: this.email,
        role: 1,
        created_at: new Date(),
        update_at: new Date(),
      };
      const usersRef = doc(db, "users", user.uid);
      await setDoc(usersRef, userIdObject);
      this.$router.push("/vote");
      this.isLoading = false;
    } catch (error: any) {
      const errorCode = error.code;
      this.errorMessage = convertErrorCode(errorCode);
      console.log(errorCode);
      this.isLoading = false;
    }
  }

  get isSignin(): User | undefined {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }

  async mounted() {
    // ユーザーの権限判定
    getAuth().onAuthStateChanged(() => {
      if (!this.isSignin) {
        return false;
      }
      if (this.isSignin) {
        this.$router.push("/vote");
      }
    });
  }
}
</script>
