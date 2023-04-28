<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />

        <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
      </div>

      <v-spacer></v-spacer>

      <v-btn v-if="auth.currentUser" @click="signOutEvent" elevation="2" icon><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss"></style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import "./firebase/firebase";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "@firebase/firestore";
import db from "./firebase/firestore";

@Component({})
export default class AppComponent extends Vue {
  auth = getAuth();
  async signOutEvent() {
    signOut(this.auth)
      .then(() => {
        console.log("Sign-out successful.");
        this.$router.push("/signin");
      })
      .catch((error) => {
        console.log("An error happened.");
        console.log(error);
      });
  }
  async getCurrentUser() {
    const user_id = this.auth.currentUser?.uid;
    if (user_id) {
      const usersRef = doc(db, "users", user_id);
      const userSnap = await getDoc(usersRef);
      if (userSnap.exists()) {
        console.log("Document data:", userSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
  }

  mounted() {
    this.getCurrentUser();
  }
}
</script>
