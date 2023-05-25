<template>
  <div class="signup" v-if="!currentUser">
    <v-container>
      <v-card maxWidth="400px" class="mx-auto mt-5">
        <v-card-title>
          <h1 class="display-1">会員登録</h1>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="mdi-account-circle" type="text" label="ニックネーム" v-model="userModel.name" />
            <v-text-field prepend-icon="mdi-email-outline" type="email" label="メールアドレス" v-model="userModel.email" />
            <v-text-field
              @click:append="showPassword = !showPassword"
              v-bind:append-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              v-bind:type="showPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              label="パスワード"
              v-model="userModel.password"
            />
            <v-card-actions>
              <v-btn v-bind:loading="isLoading" v-bind:disabled="isLoading" @click="signup">会員登録</v-btn>
              <router-link to="/signin" class=""><v-btn color="blue lighten-2" text> ログインはこちら </v-btn></router-link>
            </v-card-actions>
          </v-form>
          <v-alert type="error" v-show="errorMessage">{{ errorMessage }}</v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import db from "../firebase/firestore";
import { convertErrorCode } from "../lib/convertErrorCode";
import { User } from "@/types/User";
import { Getter } from "vuex-class";

@Component
export default class SignInView extends Vue {
  showPassword = false;
  userModel = {
    name: "",
    email: "",
    password: "",
    role: 0,
    created_at: new Date(),
    update_at: new Date(),
  };

  errorMessage: string | undefined = "";
  isLoading = false;

  async signup() {
    this.isLoading = true;
    try {
      //firebaseAuthにデータ作成
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.userModel.email, this.userModel.password);
      const userId = userCredential.user.uid;

      //usersコレクションにデータ作成
      this.userModel.created_at = new Date();
      this.userModel.created_at = new Date();
      const usersRef = doc(db, "users", userId);
      await setDoc(usersRef, this.userModel);

      //作成後ページ遷移
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
    // ユーザーの権限判定
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
