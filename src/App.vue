<template>
  <v-app v-if="isAuth">
    <v-app-bar app color="primary" dark>
      <router-link to="/" class="">
        <div class="d-flex align-center">
          <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />

          <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
        </div>
      </router-link>

      <v-spacer></v-spacer>
      <v-btn text v-if="auth.currentUser">{{ isCurrentUser.name }}</v-btn>
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
    const auth = getAuth();
    const user_id = auth.currentUser?.uid;
    if (user_id) {
      const usersRef = doc(db, "users", user_id);
      const userSnap = await getDoc(usersRef);
      if (userSnap.exists()) {
        console.log("Document data:", userSnap.data());
        const CurrentUser = userSnap.data();
        CurrentUser.id = user_id;
        this.$store.commit("setCurrentUser", CurrentUser);
        this.$store.commit("setIsAuth", true);
      } else {
        console.log("No such document!");
        this.$store.commit("setIsAuth", true);
      }
    } else {
      this.$store.commit("setIsAuth", true);
    }
  }

  get isCurrentUser(): any {
    if (this.$store.getters.currentUser) {
      return this.$store.getters.currentUser;
    }
  }

  get isAuth(): any {
    if (this.$store.getters.isAuth) {
      return this.$store.getters.isAuth;
    }
  }

  async mounted() {
    this.auth.onAuthStateChanged(() => {
      this.getCurrentUser();
    });
  }
}
</script>
