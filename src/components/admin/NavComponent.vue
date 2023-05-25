<template>
  <v-container>
    <v-card>
      <v-navigation-drawer permanent width="100%">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6"> Application </v-list-item-title>
            <v-list-item-subtitle> subtext </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item v-for="(item, index) in navItems" :key="item.title" link @click="changeNav(index)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";

@Component
export default class NavComponent extends Vue {
  navItems = [
    { title: "voteTotal", icon: "mdi-notification-clear-all" },
    { title: "contents", icon: "mdi-aspect-ratio" },
  ];

  @Emit()
  changeNav(num: number) {
    return num;
  }
}
</script>
