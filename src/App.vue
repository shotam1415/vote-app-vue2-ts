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
      <v-btn text v-if="currentUser">{{ currentUser.name }}</v-btn>
      <v-btn v-if="currentUser" @click="signOutEvent" elevation="2" icon><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "@firebase/firestore";
import db from "./firebase/firestore";
import { Getter } from "vuex-class";
import { User } from "@/types/User";

@Component
export default class AppComponent extends Vue {
  // 変数
  auth = getAuth();
  isAuth = false;

  // methods
  async signOutEvent() {
    try {
      await signOut(this.auth);
      this.$store.commit("setCurrentUser", null);
      await this.$router.push({ name: "home" }).catch(() => {
        // do nothing.
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getCurrentUser() {
    const userId = this.auth.currentUser?.uid;
    if (userId) {
      const usersRef = doc(db, "users", userId);
      const userSnap = await getDoc(usersRef);
      if (userSnap.exists()) {
        const CurrentUser = userSnap.data();
        CurrentUser.id = userId;
        this.$store.commit("setCurrentUser", CurrentUser);
        this.isAuth = true;
      } else {
        this.isAuth = true;
      }
    } else {
      this.isAuth = true;
    }
  }

  @Getter currentUser!: User | undefined;

  async mounted() {
    this.auth.onAuthStateChanged(() => {
      this.getCurrentUser();
    });
  }
}
</script>
