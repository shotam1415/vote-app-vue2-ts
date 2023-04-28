<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />

        <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="signOutEvent" elevation="2" icon><v-icon>mdi-logout</v-icon></v-btn>
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
const auth = getAuth();

@Component({})
export default class AppComponent extends Vue {
  async signOutEvent() {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
        this.$router.push("/signin");
      })
      .catch((error) => {
        console.log("An error happened.");
        console.log(error);
      });
  }
}
</script>
