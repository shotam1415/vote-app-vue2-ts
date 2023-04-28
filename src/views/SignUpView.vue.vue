<template>
  <div class="signup">
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
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase/firestore";
import { convertErrorCode } from "../lib/convertErrorCode";
@Component
export default class SigninView extends Vue {
  showPassword: boolean = false;
  name: string = "";
  email: string = "";
  password: string = "";
  errorMessage: string | undefined = "";

  signup() {
    //Todo ボタン２度押しされないようにする
    const auth = getAuth(); //Todo 後で消す
    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userIdObject = {
          name: this.name,
          email: this.email,
          role: 1,
          auth_id: user.uid,
          created_at: new Date(),
          update_at: new Date(),
        };
        const usersRef = collection(db, "users");
        const docRef = await addDoc(usersRef, userIdObject);
        console.log("Document written with ID: ", docRef.id);
      })
      .then(() => {
        console.log("success");
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
