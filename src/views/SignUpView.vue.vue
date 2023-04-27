<template>
  <div class="signup">
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">会員登録</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="mdi-account-circle" type="email" label="メールアドレス" />
          <v-text-field
            @click:append="showPassword = !showPassword"
            v-bind:append-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            v-bind:type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            label="パスワード"
          />
          <v-card-actions>
            <v-btn>会員登録</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SigninView extends Vue {
  showPassword: boolean = false;
}
</script>
